import { toValue, shallowRef } from 'vue';
import type { Reactive, Ref } from 'vue';

import http from '../utils/axios';



interface SignInForm {
    email: string;
    password: string;
}

interface SignInResponse {
    message: string;
    data: {
        accessToken: string;
    }
}

export function useLogin() {
    const isLoadding = shallowRef(false);


    async function signIn(form: Reactive<SignInForm> | Ref<SignInForm> | SignInForm): Promise<[SignInResponse | null, Error | null]> {
        const formValue = toValue(form);

        isLoadding.value = true;

        try {
            const response = await http.post<SignInResponse>('/auth/sign-in', formValue);
            isLoadding.value = false;

            return [response.data, null];
        }
        catch (err) {
            isLoadding.value = false;
            return [null, err as Error];
        }
    }

    return {
        signIn,
        isLoadding,
    }
}
