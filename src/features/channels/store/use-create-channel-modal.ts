import { atom, useAtom } from "jotai";

const creatChannelModalAtom = atom(false);

const useCreateChannelModal = () => {
  return useAtom(creatChannelModalAtom);
};

export { useCreateChannelModal };
