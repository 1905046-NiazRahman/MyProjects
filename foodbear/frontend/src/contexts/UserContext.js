import {createContext,useState} from "react"

export const UserContext = createContext()

export const UserContextProvider = ({children}) =>{
    const [foodCount,setFoodCount] = useState(0)

    const updateFoodCount = (newCount) =>{
        setFoodCount(newCount)
    }

    return (
        <UserContext.Provider value={{foodCount,updateFoodCount}}>
            {children}
        </UserContext.Provider>
    );
}