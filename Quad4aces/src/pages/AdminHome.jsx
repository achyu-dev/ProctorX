import AdminNav from "../components/AdminNav";
import OngoingTests from "../components/OngoingTests";

const AdminHome = () => {
  return (
    <div>
      <AdminNav />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'top', justifyContent: 'center', height: '40vh' }}>
        <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh' }} >Ongoing Tests</h1>
      </div>
      <OngoingTests />
    </div>
  );
};

export default AdminHome;
