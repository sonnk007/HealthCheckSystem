import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import NursePage from "../Pages/NursePage";
import PatientTable from "../component/Patient/PatientTable";
import HomePage from "../Pages/HomePage";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import DoctorLayoutPage from "../LayoutPages/DoctorLayoutPage";
import Roles from "../Enums/Enums";
import DoctorPage from "../Pages/DoctorPage";
import AdminPage from "../Pages/AdminPage";
import AdminLayoutPage from "../LayoutPages/AdminLayoutPage";
import ErrorPage from "../Pages/ErrorPage";
import UnauthorizedPage from "../Pages/UnauthorizedPage";
import NurseLayoutPage from "../LayoutPages/NurseLayoutPage";
import MedicalRecordsPage from "../Pages/MedicalRecordsPage";
import { ROUTE_URLS } from "../Commons/Global";
import CategoryTable from "../component/Admin/CategoryTable";
import CashierLayoutPage from "../LayoutPages/CashierLayoutPage";
import CashierPage from "../Pages/CashierPage";
import ListMedicalRecordPage from "../Pages/ListMedicalRecordPage";
import ListMedicalRecordUnCheckPage from "../Pages/ListMedicalRecordUnCheckPage";
import AccountsTable from "../component/Admin/AccountsTable";
import ServiceTable from "../component/Admin/ServiceTable";
import SupplyTable from "../component/Admin/SupplyTable";
import ListMedicalRecordUnPaidPage from "../Pages/ListMedicalRecordUnPaidPage";
import MrDetailPage from "../Pages/MrDetailPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_URLS.HOME_PAGE} element={<HomePage />} />
        <Route path={ROUTE_URLS.LOGIN_PAGE} element={<LoginPage />} />

        <Route
          path={ROUTE_URLS.ADMIN_HOME_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<PatientTable />} />}
              />
            }
          />

          <Route
            path={ROUTE_URLS.MEDICAL_RECORDS_PAGE}
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<MedicalRecordsPage />} />}
              />
            }
          />
        </Route>
        <Route
          path={ROUTE_URLS.LIST_MEDICAL_RECORDS_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<ListMedicalRecordPage />} />}
              />
            }
          />
        </Route>
        <Route
          path={ROUTE_URLS.ADMIN_CATEGORY_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<CategoryTable />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.ADMIN_SERVICE_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<ServiceTable />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.ADMIN_SUPPLY_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<SupplyTable />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.ADMIN_ACCOUNTS_PAGE}
          element={<ProtectedRoute role={[Roles.Admin]} />}
        >
          <Route
            path=""
            element={
              <AdminLayoutPage
                childComp={<AdminPage childComp={<AccountsTable />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.DOCTOR_HOME_PAGE}
          element={<ProtectedRoute role={[Roles.Doctor]} />}
        >
          <Route
            path=""
            element={
              <DoctorLayoutPage
                childComp={<DoctorPage childComp={<PatientTable />} />}
              />
            }
          />

          <Route
            path={ROUTE_URLS.MEDICAL_RECORDS_PAGE}
            element={
              <DoctorLayoutPage
                childComp={<DoctorPage childComp={<MedicalRecordsPage />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.DOCTOR + ROUTE_URLS.LIST_MEDICAL_RECORDS_PAGE}
          element={<ProtectedRoute role={[Roles.Doctor]} />}
        >
          <Route
            path=""
            element={
              <DoctorLayoutPage
                childComp={<DoctorPage childComp={<ListMedicalRecordPage />} />}
              />
            }
          />
        </Route>

        <Route
          path={
            ROUTE_URLS.DOCTOR + ROUTE_URLS.LIST_MEDICAL_RECORDS_UN_CHECK_PAGE
          }
          element={<ProtectedRoute role={[Roles.Doctor]} />}
        >
          <Route
            path=""
            element={
              <DoctorLayoutPage
                childComp={
                  <DoctorPage childComp={<ListMedicalRecordUnCheckPage />} />
                }
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.NURSE_HOME_PAGE}
          element={<ProtectedRoute role={[Roles.Nurse]} />}
        >
          <Route
            path=""
            element={
              <NurseLayoutPage
                childComp={<NursePage childComp={<PatientTable />} />}
              />
            }
          />

          <Route
            path={ROUTE_URLS.MEDICAL_RECORDS_PAGE}
            element={
              <NurseLayoutPage
                childComp={<NursePage childComp={<MedicalRecordsPage />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.NURSE + ROUTE_URLS.LIST_MEDICAL_RECORDS_PAGE}
          element={<ProtectedRoute role={[Roles.Nurse]} />}
        >
          <Route
            path=""
            element={
              <NurseLayoutPage
                childComp={<NursePage childComp={<ListMedicalRecordPage />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.CASHIER_HOME_PAGE}
          element={<ProtectedRoute role={[Roles.Cashier]} />}
        >
          <Route
            path=""
            element={
              <CashierLayoutPage
                childComp={<CashierPage childComp={<PatientTable />} />}
              />
            }
          />

          <Route
            path={ROUTE_URLS.MEDICAL_RECORDS_PAGE}
            element={
              <CashierLayoutPage
                childComp={<CashierPage childComp={<MedicalRecordsPage />} />}
              />
            }
          />
        </Route>

        <Route
          path={ROUTE_URLS.CASHIER + ROUTE_URLS.LIST_MEDICAL_RECORDS_PAGE}
          element={<ProtectedRoute role={[Roles.Cashier]} />}
        >
          <Route
            path=""
            element={
              <CashierLayoutPage
                childComp={
                  <CashierPage childComp={<ListMedicalRecordPage />} />
                }
              />
            }
          />
        </Route>

        <Route
          path={
            ROUTE_URLS.CASHIER + ROUTE_URLS.LIST_MEDICAL_RECORDS_UN_PAID_PAGE
          }
          element={<ProtectedRoute role={[Roles.Cashier]} />}
        >
          <Route
            path=""
            element={
              <CashierLayoutPage
                childComp={
                  <CashierPage childComp={<ListMedicalRecordUnPaidPage />} />
                }
              />
            }
          />
        </Route>

        <Route path={ROUTE_URLS.ERROR_PAGE} element={<ErrorPage />} />
        <Route
          path={ROUTE_URLS.UNAUTHORIZED_PAGE}
          element={<UnauthorizedPage />}
        />
        <Route
          path={ROUTE_URLS.MEDICAL_RECORD_DETAIL_PAGE}
          element={<DoctorLayoutPage childComp={<MrDetailPage/>} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
