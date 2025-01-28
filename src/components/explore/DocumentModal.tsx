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
import { useDocumentContent } from "@/hooks/useDocumentContent";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
  selectedIndex: string;
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
  id,
  selectedIndex,
}) => {
  const { documentContent, isLoading, isError, error } = useDocumentContent(
    id || "",
    selectedIndex
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {documentContent?.title || "Document Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && <Text>Loading document content...</Text>}
          {isError && (
            <Text color="red.500">Error loading document: {error.message}</Text>
          )}
          {!isLoading && !isError && documentContent && (
            <VStack align="stretch" spacing={4}>
              {documentContent.url && (
                <Link
                  href={documentContent.url}
                  isExternal
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  {documentContent.url}
                </Link>
              )}
              <RenderObject object={documentContent} />
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DocumentModal;
