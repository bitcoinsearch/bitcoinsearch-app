import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { FormEvent, useState } from "react";
import { getFormURL } from "../../config/config-helper";

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

  return (
    <Modal isOpen={formOpen} onClose={resetAndCloseForm}>
      <ModalOverlay />
      <ModalContent mx={{ base: "16px", lg: "0px" }} p={{ base: "16px", lg: "40px"}} maxW={{base: "400px", lg:"580px"}}>
        <ModalHeader p={0} mb={{ base: "28px", lg: "48px"}}>
          <p className="text-center font-medium mb-4 lg:mb-6 lg:text-3xl leading-none">
            Help Expand Our Source Library
          </p>
          <p className="text-center text-sm lg:text-lg font-normal">
            We manually review every suggestion to ensure it meets our standards
            for reliable, technical Bitcoin content.
          </p>
        </ModalHeader>
        <ModalBody p={0}>
          {formState.success ? (
            <Box my="10">
              <Text fontWeight={500} textAlign="center" color="green.400">
                Submitted Successfully
              </Text>
            </Box>
          ) : formState?.error ? (
            <Box my="10">
              <Text fontWeight={500} textAlign="center" color="red.400">
                {formState.error}
              </Text>
            </Box>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:gap-10">
              <FormControl className="flex flex-col gap-2 lg:gap-3">
                <label
                  className="text-sm font-semibold text-custom-black-light"
                  htmlFor="form-url"
                >
                  Source&apos;s URL
                </label>
                <Input
                  id="form-url"
                  type="url"
                  placeholder="https://"
                  onChange={(e) => setUrlValue(e.target.value)}
                  value={urlValue}
                  isRequired
                  maxLength={255}
                />
                <p className="text-[11px] font-medium text-custom-grey-dark">
                  Please enter the full URL, including http:// or https://
                </p>
              </FormControl>
              <FormControl className="flex flex-col gap-2 lg:gap-3">
                <label
                  className="text-sm font-semibold text-custom-black-light"
                  htmlFor="form-email"
                >
                  Your Email
                </label>
                <Input
                  id="form-email"
                  type="email"
                  placeholder=""
                  onChange={(e) => setEmailValue(e.target.value)}
                  value={emailValue}
                  isRequired
                  maxLength={255}
                />
                <p className="text-[11px] font-medium text-custom-grey-dark">
                  We’ll notify you once the source is approved and
                  added
                </p>
              </FormControl>
              <div className="flex gap-2 lg:gap-4">
                <Button
                  size="no-size"
                  py={3}
                  w="full"
                  fontWeight={600}
                  mx="auto"
                  type="reset"
                  colorScheme="gray"
                  isLoading={formState.loading}
                  fontSize="sm"
                  onClick={resetAndCloseForm}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="no-size"
                  py={3}
                  w="full"
                  fontWeight={600}
                  mx="auto"
                  type="submit"
                  colorScheme="blue"
                  isLoading={formState.loading}
                  fontSize="sm"
                >
                  Submit Source
                </Button>
              </div>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
