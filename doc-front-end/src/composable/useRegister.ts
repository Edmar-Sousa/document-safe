import { shallowRef, toValue, type Reactive, type Ref } from 'vue';

import http from '../utils/axios';


interface SignUpForm {
    name: string;
    email: string;
    password: string;
}




export function useRegister() {

    const isLoadding = shallowRef(false);


    async function signUp(form: Reactive<SignUpForm> | Ref<SignUpForm> | SignUpForm) {
        const formValue = toValue(form);

        isLoadding.value = true;


        try {
            const response = await http.post('/auth/sign-up', formValue);
            isLoadding.value = false;

            return [response.data, null];
        }

        catch (err) {
            isLoadding.value = false;
            return [null, err];
        }
    }

    return {
        signUp,
        isLoadding,
    }
}
