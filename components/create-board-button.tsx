"use client";

import { Button, Dialog, DialogHeader, Grid, HStack, Layout, LayoutContent, LayoutFooter, SelectableCard, Text, TextInput, VStack } from "@/components/neopop";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, WandSparkles } from "lucide-react";

import { createBoard } from "@/actions/create-board";
import { defaultImages } from "@/constants/images";
import { useAction } from "@/hooks/use-action";

const coverOptions = defaultImages.slice(0, 6);

function serializeCover(cover: (typeof defaultImages)[number]) {
  return [cover.id, cover.urls.thumb, cover.urls.full, cover.links.html, cover.user.name].join("|");
}

export function CreateBoardButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCoverId, setSelectedCoverId] = useState(coverOptions[1].id);
  const selectedCover = coverOptions.find((cover) => cover.id === selectedCoverId) ?? coverOptions[0];

  const { execute, isLoading, error, fieldErrors } = useAction(createBoard, {
    onSuccess: (board) => {
      setIsOpen(false);
      setTitle("");
      router.push(`/board/${board.id}`);
    },
  });

  const close = (open: boolean) => {
    if (!isLoading) setIsOpen(open);
  };

  return (
    <>
      <Button label="New project" variant="primary" icon={<Plus className="size-4" />} onClick={() => setIsOpen(true)} />
      <Dialog isOpen={isOpen} onOpenChange={close} purpose="form" width={680} maxHeight="88dvh">
        <Layout
          height="auto"
          header={<DialogHeader title="Start something good" subtitle="Give the work a name and a little atmosphere. We will set up a useful starting flow." onOpenChange={close} hasDivider />}
          content={
            <LayoutContent isScrollable padding={6}>
              <VStack gap={6}>
                <TextInput
                  label="Project name"
                  value={title}
                  onChange={setTitle}
                  onEnter={() => {
                    if (title.trim().length >= 3 && !isLoading) void execute({ title: title.trim(), image: serializeCover(selectedCover) });
                  }}
                  placeholder="Launch the next big thing"
                  hasAutoFocus
                  isRequired
                  width="100%"
                  status={fieldErrors?.title?.[0] ? { type: "error", message: fieldErrors.title[0] } : undefined}
                />
                <VStack gap={3}>
                  <HStack gap={2} align="center"><WandSparkles className="size-4 text-primary" /><Text weight="semibold">Choose the board energy</Text></HStack>
                  <Grid columns={{ minWidth: 150, max: 3, repeat: "fit" }} gap={3} width="100%">
                    {coverOptions.map((cover) => (
                      <SelectableCard
                        key={cover.id}
                        label={`Use ${cover.alt_description ?? "abstract"} cover by ${cover.user.name}`}
                        isSelected={selectedCoverId === cover.id}
                        onChange={() => setSelectedCoverId(cover.id)}
                        padding={0}
                        className="overflow-hidden"
                      >
                        <VStack gap={0}>
                          <span className="relative block h-24 w-full overflow-hidden">
                            <Image src={cover.urls.small} alt={cover.alt_description ?? "Project cover"} fill sizes="(max-width: 640px) 45vw, 190px" className="object-cover transition-transform duration-300 hover:scale-105" />
                          </span>
                          <Text type="supporting" color="secondary" className="truncate px-3 py-2">{cover.user.name}</Text>
                        </VStack>
                      </SelectableCard>
                    ))}
                  </Grid>
                  <Text type="supporting" color="secondary">Photography from Unsplash.</Text>
                </VStack>
                {error ? <Text className="text-destructive" role="alert">{error}</Text> : null}
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter hasDivider padding={4}>
              <HStack gap={3} justify="end">
                <Button label="Cancel" variant="ghost" onClick={() => close(false)} isDisabled={isLoading} />
                <Button label="Create project" variant="primary" isLoading={isLoading} isDisabled={title.trim().length < 3} clickAction={() => execute({ title: title.trim(), image: serializeCover(selectedCover) })} />
              </HStack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </>
  );
}
