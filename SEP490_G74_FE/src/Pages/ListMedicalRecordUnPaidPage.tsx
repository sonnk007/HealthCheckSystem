import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import MedicalRecordTable from "../component/MedicalRecords/MedicalRecordTable";
import ListMedicalRecordTable from "../component/MedicalRecords/ListMedicalRecordTable";
import ListMedicalRecordUnCheckTable from "../component/MedicalRecords/ListMedicalRecordUnCheckTable";
import ListMedicalRecordUnPaidTable from "../component/MedicalRecords/ListMedicalRecordUnPaidTable";

const ListMedicalRecordUnPaidPage = () => {
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
            <ListMedicalRecordUnPaidTable/>
        </div>
    )
}

export default ListMedicalRecordUnPaidPage