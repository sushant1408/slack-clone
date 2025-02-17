import { atom, useAtom } from "jotai";

const creatWorkspaceModalAtom = atom(false);

const useCreateWorkspaceModal = () => {
  return useAtom(creatWorkspaceModalAtom);
};

export { useCreateWorkspaceModal };
