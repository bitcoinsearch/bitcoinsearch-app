import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Link,
  UnorderedList,
  ListItem,
  Box,
  VStack,
} from "@chakra-ui/react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Record<string, any> | null;
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

const formatValue = (value: any): string => {
  if (typeof value === "string") {
    return value;
  } else if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  } else if (value instanceof Date) {
    return value.toISOString();
  }
  return "";
};

const RenderField = ({ name, value }: { name: string; value: any }) => {
  if (Array.isArray(value)) {
    return (
      <Box mb={2}>
        <Text fontWeight="bold">{name}:</Text>
        <UnorderedList ml={5}>
          {value.map((item, index) => (
            <ListItem key={index}>
              {typeof item === "object" ? (
                <RenderObject object={item} />
              ) : (
                formatValue(item)
              )}
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <Box mb={2}>
        <Text fontWeight="bold">{name}:</Text>
        <Box ml={4}>
          <RenderObject object={value} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Text mb={2}>
        <Text as="span" fontWeight="bold">
          {name}:
        </Text>{" "}
        {formatValue(value)}
      </Text>
    );
  }
};

const RenderObject = ({ object }: { object: Record<string, any> }) => {
  return (
    <VStack align="stretch" spacing={2}>
      {Object.entries(object).map(([key, value]) => (
        <RenderField key={key} name={key} value={value} />
      ))}
    </VStack>
  );
};

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  isLoading,
  isError,
  error,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{document?.title || "Document Details"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && <Text>Loading document content...</Text>}
          {isError && (
            <Text color="red.500">Error loading document: {error}</Text>
          )}
          {!isLoading && !isError && document && (
            <VStack align="stretch" spacing={4}>
              {document.url && (
                <Link
                  href={document.url}
                  isExternal
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  {document.url}
                </Link>
              )}
              <RenderObject object={document} />
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DocumentModal;
