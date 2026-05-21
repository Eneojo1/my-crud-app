import { entityConfig } from "@/config/entities";
import { Props } from "../UserForm";
import RelationField from "../fields/RelationField";
import SelectField from "../fields/SelectField";
import TextField from "../fields/TextField";

const Step1 = ({ formData, updateField }: Props) => {
  const gender = entityConfig.users.fields.find((f) => f.name === "sex");
  const role = entityConfig.users.fields.find((f) => f.name === "role_id");
  const status = entityConfig.users.fields.find((f) => f.name === "status_id");

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <TextField
        label="First Name"
        type="text"
        value={formData.fname}
        required
        onChange={(value) => updateField("fname", value)}
      />

      <TextField
        label="Middle Name"
        type="text"
        value={formData.oname}
        required
        onChange={(value) => updateField("oname", value)}
      />

      <TextField
        label="Last Name"
        type="text"
        value={formData.lname}
        required
        onChange={(value) => updateField("lname", value)}
      />

      <SelectField
        label="Gender"
        value={formData.sex}
        options={gender?.options || []}
        onChange={(value) => updateField("sex", value)}
      />

      <TextField
        label={"Email"}
        type={"email"}
        value={formData.email}
        required
        onChange={(value) => updateField("email", value)}
      />

      <TextField
        label={"Phone"}
        type={"text"}
        value={formData.phone}
        required
        onChange={(value) => updateField("phone", value)}
      />

      <RelationField
        field={role!}
        formData={formData}
        value={formData.role_id}
        onChange={(value) => updateField("role_id", value)}
      />

      <RelationField
        field={status!}
        formData={formData}
        value={formData.status_id}
        onChange={(value) => updateField("status_id", value)}
      />
    </div>
  );
};

export default Step1;
