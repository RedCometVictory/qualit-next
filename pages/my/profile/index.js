import BoardLayout from "@/components/layouts/BoardLayout";
// TODO: consider deleting this page
const Profile = () => {
  return (
    <section>My Profile Options Page</section>
  )
};
export default Profile;
Profile.getLayout = function getLayout(Profile) {
  return <BoardLayout>{Profile}</BoardLayout>
};