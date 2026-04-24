import { shallowRef } from "vue";


export function useAsyncRequest<T>(fn: Promise<any>) {
    const isLoadding = shallowRef(false);
    const isError = shallowRef(false);

    const data = shallowRef<T | null>(null);
    const error = shallowRef<Error | null>(null);

    const execute = async () => {
        isLoadding.value = true;
        isError.value = false;
        error.value = null;

        try {
            const response = await fn;
            data.value = response.data;
        } catch (err) {
            isError.value = true;
            error.value = err as Error;
        } finally {
            isLoadding.value = false;
        }
    }

    execute();

    return {
        isLoadding,
        isError,
        data,
        error
    }
}

