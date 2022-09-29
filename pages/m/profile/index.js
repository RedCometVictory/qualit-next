import BoardLayout from "@/components/layouts/BoardLayout";
const Profile = () => {
  return (
    <section>My Profile Options Page</section>
  )
};
export default Profile;
Profile.getLayout = function getLayout(Profile) {
  return <BoardLayout>{Profile}</BoardLayout>
};