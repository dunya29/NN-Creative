import { isEmail, isPassword, isPhone } from "@/functions/validation"
import { ref } from "vue"

export const useFormModule = () => {
    const emailVal = ref('')
    const passVal = ref('')
    const formError = ref(null)
    function loginValidate(val) {
        return val ? true : 'Заполните поле'
    }
    function phoneValidate(val) {
        return val
            ? isPhone(val)
                ? true
                : 'Некорретный формат телефона'
            : 'Заполните поле'
    }
    function emailValidate(val) {
        if (val) {
            if (isEmail(val)) {
                if (emailVal.value != val) {
                    emailVal.value = val
                    formError.value = null
                }
                return true
            } else {
                formError.value = null
                return 'Некорректный E-mail'
            }
        } else {
            formError.value = null
            return 'Заполните поле'
        }
    }
    function passwordValidate(val) {
        return val ? isPassword(val) ? true : 'Пароль должен содержать минимум 6 символов' : 'Заполните поле'
    }
    function loginPasswordValidate(val) {
        if (val) {
            if (passVal.value != val) {
                passVal.value = val
                formError.value = null
            }
            return true
        } else {
            formError.value = null
            return 'Заполните поле'
        }
    }
    function passwordConfirmValidate(val, password) {
        return password.value
            ? val === password.value
                ? true
                : 'Пароли должны совпадать'
            : true
    }
    function agreeValidate(val) {
        return val === true ? true : 'Требуется согласие'
    }
    return { formError, loginValidate, emailValidate, phoneValidate, passwordValidate, loginPasswordValidate, passwordConfirmValidate, agreeValidate }
}