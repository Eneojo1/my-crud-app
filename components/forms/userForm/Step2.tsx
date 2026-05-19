import { entityConfig } from "@/config/entities";
import { Props } from "./UserForm";
import RelationField from "../RelationField";
import { textarea } from "@/shared/utils";
import TextField from "../TextField";

const Step2 = ({ formData, updateField }: Props) => {
  const country = entityConfig.users.fields.find(
    (f) => f.name === "country_id",
  );
  const state = entityConfig.users.fields.find((f) => f.name === "state_id");
  const lga = entityConfig.users.fields.find((f) => f.name === "lga_id");

  const pwdMatch = formData.password === formData.confirmPassword;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {country && (
        <RelationField
          field={country}
          formData={formData}
          value={formData.country_id}
          onChange={(value) => updateField("country_id", value)}
        />
      )}

      {state && (
        <RelationField
          field={state}
          formData={formData}
          value={formData.state_id}
          onChange={(value) => updateField("state_id", value)}
        />
      )}

      {lga && (
        <RelationField
          field={lga}
          formData={formData}
          value={formData.lga_id}
          onChange={(value) => updateField("lga_id", value)}
        />
      )}

      <textarea
        placeholder={"Address"}
        value={formData.address || ""}
        required
        onChange={(e) => updateField("address", e.target.value)}
        onInput={textarea}
        className="border p-2 w-full rounded h-10 resize-none"
      />

      <TextField
        label="Password"
        type="password"
        value={formData.password}
        required
        onChange={(value) => updateField("password", value)}
      />

      <div>
        <TextField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          required
          onChange={(value) => updateField("confirmPassword", value)}
        />

        {formData.confirmPassword && (
          <p
            className={`${pwdMatch ? "text-green-600" : "text-red-500"} text-sm mt-1`}
          >
            {pwdMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step2;
