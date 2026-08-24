import { Category } from "../../../domain/entities/Category";

export class CategoryMapper{
    static toDomainMultiple(data: any): Category[] | []{
        return data.map((doc:any) => (
            new Category(
                doc.name,
                doc.description,
                doc.commissionPercentage,
                doc.slug,
                doc.icon,
                doc.status,
                doc._id,
            )
        ))
    }

    static toDomain(data: any): Category{
        return new Category(
            data.name,
            data.description,
            data.commissionPercentage,
            data.slug,
            data.icon,
            data.status,
            data._id.toString()
        )
    }
}