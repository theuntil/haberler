import YunusSeyyahClient from "./YunusSeyyahClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <YunusSeyyahClient lang="tr" />;
}
