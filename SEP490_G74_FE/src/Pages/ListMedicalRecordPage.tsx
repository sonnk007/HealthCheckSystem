import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import MedicalRecordTable from "../component/MedicalRecords/MedicalRecordTable";
import ListMedicalRecordTable from "../component/MedicalRecords/ListMedicalRecordTable";

const ListMedicalRecordPage = () => {
    const navigate = useNavigate()
   // const { id } = useParams()
    //const [, setPatientId] = useState<number>(0)
    //const numberRegex = /^\d+$/;

    // const validateUserId = () => {
    //     if (id === undefined) {
    //         navigate("/")
    //     } else {
    //         if (!numberRegex.test(id)) {
    //             navigate("/")
    //         } else {
    //             setPatientId(Number.parseInt(id))
    //         }
    //     }
    // }

    useEffect(() => {
        //validateUserId()
    }, [])
    return(
        <div>
            <ListMedicalRecordTable/>
        </div>
    )
}

export default ListMedicalRecordPage