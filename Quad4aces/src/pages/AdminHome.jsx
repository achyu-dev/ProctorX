import AdminNav from "../components/AdminNav";
import OngoingTests from "../components/OngoingTests";

const AdminHome = () => {
  return (
    <div>
      <AdminNav />
      <div className="content">
        <h1>Ongoing Tests</h1>
        <OngoingTests />
      </div>
    </div>
  );
};

export default AdminHome;
