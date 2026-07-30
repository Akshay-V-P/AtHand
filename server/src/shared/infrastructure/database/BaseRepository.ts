import { Model, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T> {
    constructor(protected model: Model<T>) { }
    
    protected async createDocument(data: Partial<T>): Promise<T>{
        const newDoc = new this.model(data)
        await newDoc.save()
        return newDoc
    }

    protected async findDocumentById(id: string): Promise<T | null>{
         return await this.model.findById(id)
    }

    protected async findDocumentByEmail(email: string): Promise<T | null>{
        return await this.model.findOne({email})
    }

    protected async updateDocument(id: string, updateData: UpdateQuery<T>): Promise<T | null>{
        return await this.model.findByIdAndUpdate(id, updateData, {new:true})
    }
}