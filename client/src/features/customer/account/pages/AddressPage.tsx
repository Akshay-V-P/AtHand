import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, type AddressFormData } from '../validation/addressSchema';
import { accountServices } from '../services/accountServices';
import type { AddressResponseDTO } from '../dtos/AddressDTO';
import { Modal } from '../../../../components/common/Modal';
import { Form } from '../../../../components/common/Form';
import { InputField } from '../../../../components/common/InputField';
import { Button } from '../../../../components/common/Button';
import toast from 'react-hot-toast';
import { MapPin, Home, Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';

const AddressPage = () => {
  const [addresses, setAddresses] = useState<AddressResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponseDTO | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await accountServices.getAddresses();
      setAddresses(data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    reset({ label: '', houseName: '', area: '', city: '', state: '', pincode: '', isPrimary: false });
    setIsModalOpen(true);
  };

  const openEditModal = (address: AddressResponseDTO) => {
    setEditingAddress(address);
    reset({
      label: address.label,
      houseName: address.houseName,
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isPrimary: address.isPrimary
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await accountServices.deleteAddress(id);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    const payload = {
      ...data,
      coordinates: { type: 'Point' as const, coordinates: [0, 0] as [number, number] }
    };

    try {
      if (editingAddress) {
        await accountServices.updateAddress({ ...payload, id: editingAddress.id });
        toast.success('Address updated successfully');
      } else {
        await accountServices.addAddress(payload);
        toast.success('Address added successfully');
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    }
  };

  return (
    <div className="flex-1 w-full max-h-screen pt-4">
      <div className="flex justify-between items-center mb-8 px-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Saved Addresses</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <span className="text-gray-400 font-medium animate-pulse">Loading addresses...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-4">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <MapPin size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No addresses found</h3>
          <p className="text-gray-500 text-sm max-w-sm">You haven't saved any addresses yet. Add one now to make booking faster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-h-[75dvh] overflow-y-auto hide-scrollbar px-2 pb-10">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`group relative border ${addr.isPrimary ? 'border-blue-400 ring-1 ring-blue-50/50 bg-blue-50/10' : 'border-gray-100 bg-white'} rounded-[1.5rem] p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden`}
            >
              {addr.isPrimary && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-[1rem] shadow-sm">
                  Primary Default
                </div>
              )}

              <div className="flex justify-between items-start mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${addr.label.toLowerCase() === 'home' ? 'bg-black text-white' : addr.label.toLowerCase() === 'work' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {addr.label.toLowerCase() === 'home' ? <Home size={20} /> : addr.label.toLowerCase() === 'work' ? <Briefcase size={20} /> : <MapPin size={20} />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 capitalize tracking-tight">{addr.label}</h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 flex-grow px-1">
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  <span className="font-semibold text-gray-900 block mb-1 text-base">{addr.houseName}</span>
                  {addr.area}, {addr.city}<br />
                  {addr.state}, {addr.pincode}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAddress ? "Edit Address" : "Add New Address"}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto px-1 hide-scrollbar">
            <InputField inputLabel="Label (e.g. Home, Work)" placeholder="Enter label" {...register('label')} label={errors.label?.message} />
            <InputField inputLabel="House / Building Name" placeholder="Enter house name" {...register('houseName')} label={errors.houseName?.message} />
            <InputField inputLabel="Area / Street" placeholder="Enter area" {...register('area')} label={errors.area?.message} />
            <div className="grid grid-cols-2 gap-4">
              <InputField inputLabel="City" placeholder="Enter city" {...register('city')} label={errors.city?.message} />
              <InputField inputLabel="State" placeholder="Enter state" {...register('state')} label={errors.state?.message} />
            </div>
            <InputField inputLabel="Pincode" placeholder="Enter pincode" {...register('pincode')} label={errors.pincode?.message} />

            <div className="flex items-center gap-2 mt-4 ml-1 mb-2">
              <input
                type="checkbox"
                id="isPrimary"
                className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black accent-black cursor-pointer"
                {...register('isPrimary')}
              />
              <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Set as default primary address</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-100 !text-gray-700 hover:bg-gray-200 border border-transparent shadow-none">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressPage;