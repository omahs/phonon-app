import { IonButton, IonModal } from "@ionic/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CHAINS } from "../constants/chains";
import { useIsConnected } from "../hooks/useIsConnected";
import { useSession } from "../hooks/useSession";
import { usePairMutation, useSendPhononMutation } from "../store/api";
import { weiToEth } from "../utils/denomination";

export type SendPhononFormData = {
  cardId: string;
};

const SendPhononModal: React.FC<{
  isModalVisible;
  hideModal;
  phonon: PhononDTO;
  setSelectedPhonon: React.Dispatch<
    React.SetStateAction<PhononDTO | undefined>
  >;
}> = ({ isModalVisible, hideModal, phonon, setSelectedPhonon }) => {
  const { sessionId } = useSession();
  const [errorMessage, setErrorMessage] = useState("");
  const [sendPhonon, { isLoading: isSending }] = useSendPhononMutation();
  const [pair, { isLoading: isPairing }] = usePairMutation();
  const chain = CHAINS[phonon.ChainID] ?? null;
  const { isConnected } = useIsConnected();

  const isLoading = isSending || isPairing;

  const destroyModal = () => {
    setErrorMessage("");
    hideModal();
    reset();
  };

  const { register, handleSubmit, reset } = useForm<SendPhononFormData>();

  const onSubmit = async (data: SendPhononFormData, event) => {
    event.preventDefault();

    if (!isConnected) {
      throw new Error("Must be connected.");
    }
    const payload: SendPhononDTO = [phonon];
    await pair({ cardId: data.cardId, sessionId })
      .then(() => {
        sendPhonon({ payload, sessionId })
          .then(() => {
            destroyModal();
            // if successful, we remove selected phonon
            setSelectedPhonon(undefined);
          })
          .catch((err) => {
            setErrorMessage(err.message);
            console.error(err);
          });
      })
      .catch((err) => {
        setErrorMessage(err.message);
        console.error(err);
      });
  };

  return (
    <IonModal isOpen={isModalVisible} onDidDismiss={destroyModal}>
      <div className="flex flex-col content-center justify-center h-full mx-10">
        <p className="text-xl font-bold text-center text-gray-300 uppercase">
          Send {chain?.name} Phonon
        </p>
        <p className="font-bold text-center text-red-400 uppercase mt-2">
          {errorMessage}
        </p>
        <p className="text-l font-bold text-center text-gray-400 uppercase">
          {`${weiToEth(phonon.Denomination)} ${chain ? chain.ticker : "ERR"}`}
        </p>

        <form className="flex flex-col mt-12" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="text-bold p-2 text-xl text-white bg-zinc-800 shadow-inner"
            placeholder="Recipient Card ID"
            disabled={isLoading}
            {...register("cardId", {
              required: true,
            })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 mt-4">
            <IonButton
              key="submit"
              size="large"
              fill="solid"
              expand="full"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              SEND
            </IonButton>
            <IonButton
              size="large"
              expand="full"
              fill="clear"
              color="medium"
              onClick={destroyModal}
              disabled={isLoading}
            >
              CANCEL
            </IonButton>
          </div>
        </form>
      </div>
    </IonModal>
  );
};

export default SendPhononModal;
