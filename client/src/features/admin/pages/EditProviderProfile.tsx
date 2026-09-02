import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useOutletContext } from 'react-router-dom'
import ServicePill from '../../../components/admin/ServicePill'
import { InputField } from '../../../components/common/InputField'
import type { ProviderDetails } from '../../provider/intefaces/IProviderDetails'
import { adminServices } from '../services/adminServices'

type BusinessDetailsForm = {
  businessName: string; contactPerson: string; phone: string; email: string
  street: string; city: string; district: string; state: string; pincode: string
}

const formValues = (provider: ProviderDetails): BusinessDetailsForm => ({
  businessName: provider.businessName ?? '', contactPerson: provider.contactPerson ?? '',
  phone: provider.phone ?? '', email: provider.email ?? '',
  street: provider.location?.address.street ?? '', city: provider.location?.address.city ?? '',
  district: provider.location?.address.district ?? '', state: provider.location?.address.state ?? '',
  pincode: provider.location?.address.pincode ?? '',
})

const EditProviderProfile = () => {
  const { provider, setProvider } = useOutletContext<{
    provider: ProviderDetails | null
    setProvider: (provider: ProviderDetails | null) => void
  }>()
  const [isEditing, setIsEditing] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BusinessDetailsForm>()

  useEffect(() => { if (provider) reset(formValues(provider)) }, [provider, reset])

  const cancelEdit = () => {
    if (provider) reset(formValues(provider))
    setIsEditing(false)
  }

  const onSubmit = async (data: BusinessDetailsForm) => {
    if (!provider?.id || !provider.location) return
    try {
      const response = await adminServices.updateProvider(provider.id, {
        businessName: data.businessName.trim(), contactPerson: data.contactPerson.trim(),
        phone: data.phone.trim(), email: data.email.trim(),
        location: {
          address: {
            street: data.street.trim(), city: data.city.trim(), district: data.district.trim(),
            state: data.state.trim(), pincode: data.pincode.trim(),
          },
          coordinates: provider.location.coordinates,
        },
      })
      setProvider(response.data.data)
      setIsEditing(false)
      toast.success('Business details updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update business details')
    }
  }

  const required = (name: string) => ({ required: `${name} is required` })

  return (
    <div className='overflow-y-auto max-h-screen'>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors cursor-pointer">Edit Details</button>
          ) : (
            <div className="flex gap-3">
              <button type="button" onClick={cancelEdit} disabled={isSubmitting} className="text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">Cancel</button>
              <button type="submit" form="provider-business-details" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{isSubmitting ? 'Saving...' : 'Save changes'}</button>
            </div>
          )}
        </div>

        <form id="provider-business-details" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InputField inputLabel="Legal Business Name" disabled={!isEditing} {...register('businessName', required('Business name'))} label={errors.businessName?.message} />
          <InputField inputLabel="Primary Contact" disabled={!isEditing} {...register('contactPerson', required('Contact person'))} label={errors.contactPerson?.message} />
          <InputField inputLabel="Business Phone" type="tel" disabled={!isEditing} {...register('phone', { ...required('Phone'), minLength: { value: 10, message: 'Enter a valid phone number' }, maxLength: { value: 15, message: 'Enter a valid phone number' } })} label={errors.phone?.message} />
          <InputField inputLabel="Business Email" type="email" disabled={!isEditing} {...register('email', { ...required('Email'), pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} label={errors.email?.message} />
          <div className="col-span-full border-t border-gray-100 pt-6"><h3 className="font-semibold text-gray-900">Service Address</h3></div>
          <InputField inputLabel="Street" disabled={!isEditing} {...register('street', required('Street'))} label={errors.street?.message} />
          <InputField inputLabel="City" disabled={!isEditing} {...register('city', required('City'))} label={errors.city?.message} />
          <InputField inputLabel="District" disabled={!isEditing} {...register('district', required('District'))} label={errors.district?.message} />
          <InputField inputLabel="State" disabled={!isEditing} {...register('state', required('State'))} label={errors.state?.message} />
          <InputField inputLabel="Pincode" disabled={!isEditing} {...register('pincode', { ...required('Pincode'), minLength: { value: 6, message: 'Pincode must be 6 characters' }, maxLength: { value: 6, message: 'Pincode must be 6 characters' } })} label={errors.pincode?.message} />
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Service Catalog</h2>
        <div className="flex flex-wrap items-center gap-4">
          <ServicePill label="Electronics" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 012-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} />
        </div>
      </div>
    </div>
  )
}

export default EditProviderProfile
