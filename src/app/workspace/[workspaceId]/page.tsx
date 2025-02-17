import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceIdScreenProps {
  params: Promise<{ workspaceId: Id<"workspaces"> }>;
}

export default async function WorkspaceIdScreen({
  params,
}: WorkspaceIdScreenProps) {
  const { workspaceId } = await params;

  return <>{workspaceId}</>;
}
