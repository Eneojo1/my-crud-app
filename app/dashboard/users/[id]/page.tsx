import { fullName } from "@/shared/utils";
import { users } from "../data";

const Profile = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));
  console.log(params);

  return <div>Profile {fullName(user)}</div>;
};

export default Profile;
