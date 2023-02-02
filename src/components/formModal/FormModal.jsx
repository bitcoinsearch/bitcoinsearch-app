import {
  Box,
  Button,
  Center,
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
import React, { useState } from "react";
import { getFormURL } from "../../config/config-helper";

const FormModal = ({ formOpen, closeForm }) => {
  const [urlValue, setUrlValue] = useState("");
  const [formState, setFormState] = useState({
    loading: false,
    error: "",
    success: null,
  });

  const url = getFormURL();

  const submitToSheet = async (data) => {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });
    return response.json();
  };

  const handleSubmit = (e) => {
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
      <ModalContent mx={{ base: "16px", md: "0px" }}>
        <ModalHeader>
          <Text align="center" fontWeight={500}>
            User Domain Submission
          </Text>
        </ModalHeader>
        <ModalBody>
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
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel fontWeight={400} htmlFor="form-url">
                  URL
                </FormLabel>
                <Input
                  id="form-url"
                  type="url"
                  placeholder="https://"
                  onChange={(e) => setUrlValue(e.target.value)}
                  value={urlValue}
                  isRequired
                />
                <FormHelperText>
                  Enter a valid url, should contain http/https
                </FormHelperText>
                <Center my="5">
                  <Button
                    fontWeight={400}
                    mx="auto"
                    type="submit"
                    colorScheme="blue"
                    isLoading={formState.loading}
                  >
                    Submit
                  </Button>
                </Center>
              </FormControl>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
