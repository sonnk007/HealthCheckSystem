import { useContext, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { AuthContext } from "../ContextProvider/AuthContext"
import { ROUTE_URLS } from "../Commons/Global"

type ProtectedRouteProps = {
    role: string[]
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
    const { authenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        handleGetMe()
    }, [])

    const handleGetMe = () => {
        try {
            console.log(authenticated);
            if(authenticated === undefined){
                navigate(ROUTE_URLS.LOGIN_PAGE)
            }else{
                if(!role.includes(authenticated.role)){
                    navigate(ROUTE_URLS.UNAUTHORIZED_PAGE)
                }else{
                    setIsLoading(false)
                }
            }
        }catch{
            navigate(ROUTE_URLS.ERROR_PAGE)
        }
    }
    return isLoading ? <></> : <Outlet/>
}

export default ProtectedRoute