import {
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FormEvent, useState } from "react";
import { getFormURL } from "../../config/config-helper";
import CircleCheck from "public/circle-tick.svg"
import Image from "next/image";

const FormModal = ({ formOpen, closeForm }) => {
  const [urlValue, setUrlValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [formState, setFormState] = useState({
    loading: false,
    error: "",
    success: null,
  });

  const url = getFormURL();

  const submitToSheet = async (data: FormData) => {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    return response.json();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("URL", urlValue);
    setFormState((prev) => ({ ...prev, loading: true }));
    setUrlValue("");
    submitToSheet(data)
      .then((res) => {
        if (res.result === "success") {
          setFormState({ loading: false, error: "", success: true });
        } else {
          throw Error(res.result);
        }
      })
      .catch((err) => {
        setFormState({
          loading: false,
          error: err.message ?? "Unsuccessful, Try again later",
          success: false,
        });
      });
  };

  const resetAndCloseForm = () => {
    setFormState({ loading: false, success: false, error: "" });
    setUrlValue("");
    closeForm();
  };

  const formIsComplete = !!(emailValue.trim() && urlValue.trim())

  return (
    <Modal isOpen={formOpen} onClose={resetAndCloseForm}>
      <ModalOverlay />
      <ModalContent
        mx={{ base: "16px", lg: "0px" }}
        maxW={{ base: "400px", lg: "580px" }}
        borderRadius={20}
      >
        <div className="bg-custom-background p-4 lg:p-10 rounded-[20px]">
          <ModalHeader p={0} mb={{ base: "28px", lg: "42px" }}>
            <p className="text-center text-custom-primary-text font-medium mb-4 lg:mb-5 lg:text-3xl leading-none">
              Help Expand Our Source Library
            </p>
            <p className="text-center text-custom-secondary-text text-sm lg:text-lg font-normal">
              We manually review every suggestion to ensure it meets our standards
              for reliable, technical Bitcoin content.
            </p>
          </ModalHeader>
          <ModalBody p={0}>
            {formState.success ? (
              <div className="flex mt-10 py-3 justify-center gap-2 bg-[#72BF6A] rounded-lg">
                <Image src={CircleCheck} alt="success icon" />
                <p className="font-bold w-fit">Submitted Successfully</p>
              </div>
            ) : formState?.error ? (
              <div className="flex mt-10 py-3 justify-center gap-2 bg-red-600 rounded-lg">
                {/* <Image src={CircleCheck} alt="success icon" /> */}
                <p className="font-bold w-fit">Submission Failed</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 lg:gap-8 text-custom-primary-text"
              >
                <FormControl className="flex flex-col gap-[6px] lg:gap-2">
                  <label
                    className="ml-1 text-sm lg:text-base font-semibold"
                    htmlFor="form-url"
                  >
                    Source&apos;s URL
                  </label>
                  <input
                    id="form-url"
                    type="url"
                    placeholder="https://"
                    onChange={(e) => setUrlValue(e.target.value)}
                    value={urlValue}
                    required
                    maxLength={255}
                    className="bg-custom-background px-2 py-2 lg:py-[10px] border-[1px] border-custom-stroke rounded-[10px] focus:border-custom-accent focus:outline-none"
                  />
                  <p className="ml-1 text-[11px] lg:text-sm font-medium text-custom-secondary-text">
                    Please enter the full URL, including http:// or https://
                  </p>
                </FormControl>
                <FormControl className="flex flex-col gap-[6px] lg:gap-2">
                  <label
                    className="ml-1 text-sm lg:text-base font-semibold"
                    htmlFor="form-email"
                  >
                    Your Email
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    placeholder=""
                    onChange={(e) => setEmailValue(e.target.value)}
                    value={emailValue}
                    required
                    className="bg-custom-background px-2 py-2 lg:py-[10px] border-[1px] border-custom-stroke rounded-[10px] focus:border-custom-accent focus:outline-none"
                  />
                  <p className="ml-1 text-[11px] lg:text-sm font-medium text-custom-secondary-text">
                    We’ll notify you once the source is approved and added
                  </p>
                </FormControl>
                <div className="flex gap-2 lg:gap-4 text-custom-primary-text">
                  <button
                    className="py-3 w-full font-bold mx-auto text-sm lg:text-base bg-custom-otherLight rounded-[10px]"
                    disabled={formState.loading}
                    type="reset"
                    onClick={resetAndCloseForm}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-3 w-full font-bold mx-auto text-sm text-white lg:text-base bg-custom-accent disabled:bg-custom-hover-state disabled:cursor-not-allowed disabled:text-[#CCBAA3] rounded-[10px]"
                    disabled={!formIsComplete}
                    type="submit"
                  >
                    Submit Source
                  </button>
                </div>
              </form>
            )}
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
