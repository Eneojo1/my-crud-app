import { formatDate, fullName } from "@/shared/utils";
import { users } from "../data";
import {
  Bell,
  Info,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { IconType } from "react-icons";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex flex-col gap-1 max-w-5xl mx-auto pb-4 px-6 overflow-hidden">
      <div className="flex flex-col gap-2 bg-se4 px-6 py-2 rounded-2xl">
        <div className="flex gap-3 justify-between sm:items-center text-sm">
          <span className="text-pr1">
            {"Users > "}
            <strong>{fullName(user)}</strong>
          </span>
          <span className="flex gap-3">
            <Bell size={18} />
            <Avatar className="h-7 w-7">
              <AvatarImage src="/beauty.jpg" alt={user?.fname} />
              <AvatarFallback>
                {user?.fname?.charAt(0)}
                {user?.lname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </span>
        </div>

        <div className="flex gap-3 justify-between sm:items-center">
          <h3 className="font-bold text-pr1">USER PROFILE</h3>
          <div className="flex gap-3">
            <button className="btn">Edit User</button>
            <button className="btn btn-gray">More &#9660;</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionCard>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:m-auto">
              <ul className="flex flex-col justify-center items-center gap-2">
                <li>
                  <Avatar className="h-30 w-30 mt-4">
                    <AvatarImage src="/beauty.jpg" alt={user?.fname} />
                    <AvatarFallback>
                      {user?.fname?.charAt(0)}
                      {user?.lname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </li>
                <li className="bg-green-100 text-sm rounded px-2">Active</li>
              </ul>

              <ul className="flex flex-col gap-2 text-sm text-se6 [&>li]:flex">
                <li className="font-bold text-lg">{fullName(user)}</li>
                <li>
                  <ShieldCheck className="mr-2 text-pr2 h-5 w-5" />
                  {user.role.name}. {user?.role.description}
                </li>
                <li>
                  <Mail className="mr-2 text-pr2 h-5 w-5" />
                  {user.email}
                </li>
                <li>
                  <Phone className="mr-2 text-pr2  h-5 w-5" /> {user.phone}
                </li>
                <li>
                  <MapPin className="mr-2 text-pr2 h-5 w-5" /> {user.address}
                </li>
              </ul>
            </div>

            <div className="h-px sm:h-auto sm:w-px bg-gray-200 my-4 sm:mx-4" />

            <div className="flex flex-col gap-2 text-sm text-se6 m-auto">
              <Item label="User Id" value={String(user.id)} />
              <Item label="Joined" value={formatDate(user.created_at)} />
              <Item label="Last Updated" value={formatDate(user.updated_at)} />
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-col lg:flex-row gap-4 px-2 lg:px-4 m-auto">
          <SectionCard title="Personal Information" icon={User}>
            <Item label="First Name" value={user.fname} />
            <Item label="Other Name" value={user.oname} />
            <Item label="Last Name" value={user.lname} />
            <Item label="Gender" value={user.sex} />
            <Item label="Phone" value={user.email} />
          </SectionCard>

          <SectionCard title="Location" icon={MapPin}>
            <Item label="Country" value={String(user.country_id)} />
            <Item label="State" value={String(user.state_id)} />
            <Item label="LGA" value={String(user.lga_id)} />
            <Item label="Address" value={user.address} />
          </SectionCard>

          <SectionCard title="Account Information" icon={Info}>
            <Item label="Role" value={user.role.name} />
            <Item label="Status" value={user.status.name} />
            <Item label="Joined" value={formatDate(user.created_at)} />
            <Item label="Last Updated" value={formatDate(user.updated_at)} />
          </SectionCard>
        </div>

        <SectionCard title="Socials" icon={Info}>
          <div className="flex gap-5">
            <InfoItem
              icon={FaFacebookF}
              label="Facebook"
              value="john@mail.com"
              href="https://facebook.com/john"
            />

            <InfoItem
              icon={FaTwitter}
              label="Twitter"
              value="john@mail.com"
              href="https://facebook.com/john"
            />

            <InfoItem
              icon={FaGithub}
              label="GitHub"
              value="github.com/john"
              href="https://github.com/john"
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

type InfoItemProps = {
  icon: LucideIcon | IconType;
  label: string;
  value: string;
  href?: string;
};

export function InfoItem({ icon: Icon, label, value, href }: InfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-7 h-7 text-pr2 rounded-full p-1 border shadow-md transition" />

      <div className="text-se6 text-xs">
        <p className="font-semibold text-pr1">{label}</p>

        {href ? (
          <a
            href={href}
            target="_blank"
            className="font-medium hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

type SectionCardProps = {
  title?: string;
  children: React.ReactNode;
  icon?: LucideIcon | IconType;
};

export function SectionCard({ title, children, icon: Icon }: SectionCardProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm text-sm px-6 sm:px-0">
      {title && (
        <div className="flex items-center gap-2 borderb px-4 py-3">
          {Icon && <Icon className="h-5 w-5 text-pr2" />}
          <h3 className="font-semibold text-pr1">{title}</h3>
        </div>
      )}
      <div className="px-4 pb-3">{children}</div>
    </div>
  );
}

export function Item({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between mr-3 text-se6">
      <strong className="mr-3">{label}:</strong> {value}
    </p>
  );
}
