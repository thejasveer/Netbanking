import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { trpc } from "./utils/trpc";
import { Button } from "./components/Button";
import { Error } from "./components/Error";
import { Row } from "./components/Row";
import { Center } from "./components/Center";
import { Back } from "./components/Back";
import { Loader } from "./components/Loader";
import { useWebSocket } from "./hooks/useWebSocket";

export const ConfirmPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [, setfetch] = useState(false);
  const payload = trpc.bank.getPayloadDetails.useQuery({
    paymentToken: paymentToken || "",
  });
  const [userId, setUserId] = useState<number | null>(null); // Example user ID

  const { messages } = useWebSocket(userId);
  const [websocketLoading, setWebscoketLoading] = useState(false);
  useEffect(() => {
    if (
      messages &&
      messages.status == "SUCCESS" &&
      messages.token == paymentToken
    ) {
      navigate("/success");
    }
  }, [messages]);

  //get user bank details

  useEffect(() => {
    const token = searchParams.get("paymentToken");
    if (token) {
      setPaymentToken(token);
      setfetch(true);
    }
  }, []);

  const bankAction = trpc.bank.action.useMutation({
    onSuccess: (data) => {
      setWebscoketLoading(true);
      setUserId(Number(data.userId));
      // navigate('/success')
      // window.close();
    },
    onError: (data) => {
      if (data.message) {
        navigate("/failed?msg=" + data.message);
      }
    },
  });
  const confirmPayment = () => {
    if (paymentToken) {
      bankAction.mutate({ token: paymentToken });
    }
  };
  const handleback = () => {
    navigate("/banks?paymentToken=" + paymentToken);
  };

  if (payload.isLoading && payload.data) {
    return <Loader />;
  }
  if (payload.isError) {
    return (
      <Center>
        {" "}
        <Error msg="Something went wrong. Please close this window and try again later"></Error>
      </Center>
    );
  }

  return (
    <Center>
      <div className="p-14 flex flex-col  gap-4">
        <Back fn={() => handleback()} />
        <Row
          keyStr={payload.data?.toFrom}
          value={{
            heading: `Checking Acc (${payload.data?.bankName})`,
            value: "$" + Math.floor(payload.data?.balance || 0).toFixed(2),
          }}
        />
        <Row
          keyStr={"Amount"}
          value={{
            heading: "$" + Math.floor(payload.data?.amount || 0).toFixed(2),
            value: "",
          }}
        />
        <Row
          keyStr={"DATE"}
          value={{ heading: new Date().toDateString(), value: "" }}
        />
        <div className="mt-24 flex flex-col items-center">
          <p className="text-center">
            By clicking "Confirm" you authorize this payment{" "}
          </p>

          <Button
            action={confirmPayment}
            loading={bankAction.isPending || websocketLoading}
            text={"Confirm"}
          />
          {bankAction.isError && <Error msg={bankAction.error.message} />}
        </div>
      </div>
    </Center>
  );
};
