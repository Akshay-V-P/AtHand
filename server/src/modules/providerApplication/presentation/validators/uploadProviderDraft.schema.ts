import {z} from "zod";

const businessDetailsSchema = z.object({
    businessName: z
        .string()
        .trim()
        .min(3, "Business name required"),
    contactPerson: z
        .string()
        .trim()
        .min(3, "Contact person required"),
    phone: z
        .string()
        .trim()
        .min(10, "Enter a valid phone number")
        .max(15, "Enter a valid phone number"),
    email: z
        .email("Please enter a valid email")
        .trim(),
})

const addressSchema = z.object({
    street: z
        .string()
        .trim()
        .min(3, "Please enter a valid street name"),
    city: z
        .string()
        .trim()
        .min(3, "Please enter a valid city"),
    district: z
        .string()
        .trim()
        .min(3, "Please enter a valid district"),
    state: z
        .string()
        .trim()
        .min(2, "Please enter a valid state"),
    pincode: z
        .string()
        .trim()
        .length(6, "Please enter a valid pincode"),
})

const coordinatesSchema = z.object({
    type: z.literal("Point"),

    coordinates: z
        .tuple([
            z.number(), // longitude
            z.number(), // latitude
        ])
        .refine(
            ([longitude]) =>
                longitude >= -180 && longitude <= 180,
            {
                message: "Invalid longitude",
            }
        )
        .refine(
            ([, latitude]) =>
                latitude >= -90 && latitude <= 90,
            {
                message: "Invalid latitude",
            }
        ),
});

const locationDetailsSchema = z.object({
    address: addressSchema,
    coordinates: coordinatesSchema,
})


const serviceDetailsSchema = z.object({
    serviceCategory: z
        .string()
        .min(1, "Service category is required"),

    serviceRadius: z
        .number()
        .min(1, "Minimum radius is 1km")
        .max(30, "Maximum allowed service radius is 30km")

});

const documentSchema = z.object({
    providerId: z
        .string()
        .trim()
        .regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid provider ID"
        ),

    documentType: z.enum([
        "TECHNICAL CERTIFICATE",
        "BUSINESS LICENSE",
        "GOVERNMENT ID FRONT",
        "GOVERNMENT ID BACK"
    ], {
        error: "Invalid document type",
    }),

    documentKey: z
        .string()
        .trim()
        .min(1, "Document key is required"),

    remarks: z
        .string()
        .optional(),

    verificationStatus: z.enum([
        "VERIFIED",
        "PENDING",
        "REJECTED",
    ]).default("PENDING"),
});

const documentsSchema = z.array(documentSchema);



export const updateProviderDraftSchema = z.object({
    userId:z.string().trim().regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid document ID"
        ),
    businessDetails: businessDetailsSchema.optional(),
    locationDetails: locationDetailsSchema.optional(),
    serviceDetails: serviceDetailsSchema.optional(),
    documents:documentsSchema.optional(),
})

