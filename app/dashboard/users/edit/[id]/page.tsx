import { users } from "../../data";

import UsersForm from "@/components/forms/UserForm";

const EditUser = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));
  return <UsersForm initialData={user} />;
};

export default EditUser;
