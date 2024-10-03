import { useEffect, useState } from "react"

const useDebounce = <T>(value: T, delay = 500 ) => {
    const [debouncedValue , setDebounceValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(value);
            console.log('valu set')
        },delay)

        return () => clearTimeout(timeout);
        
    },[value, delay])

    return debouncedValue
}

export default useDebounce;