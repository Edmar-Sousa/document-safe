import { SelectQueryBuilder } from "typeorm";

// @ts-ignore
export async function paginate<T>(queryBuilder: SelectQueryBuilder<T>, page: number, limit: number) {

    const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
    };
}