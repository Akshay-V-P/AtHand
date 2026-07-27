import { useState } from "react"

type UseTogglePasswordReturn = [
    string,
    () => void,
    boolean
]


export function useTogglePassword():UseTogglePasswordReturn {
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const toggleVisiblity = () => {
        setIsVisible((prev)=>!prev)
    }

    const inputType = isVisible ? "text" : "password"
    
    return [inputType, toggleVisiblity, isVisible]
}