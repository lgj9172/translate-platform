import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormData = {
  category:
    | "IT"
    | "FINANCE"
    | "CONTENTS"
    | "GAME"
    | "LAW"
    | "MEDICAL"
    | "CONSTRUCTION"
    | "MARKETING"
    | "LITERATURE"
    | "ETC";
};

function CategoryForm() {
  const schema = z.object({
    category: z
      .enum([
        "IT",
        "FINANCE",
        "CONTENTS",
        "GAME",
        "LAW",
        "MEDICAL",
        "CONSTRUCTION",
        "MARKETING",
        "LITERATURE",
        "ETC",
      ])
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("category")}>
        <option value="">카테고리 선택</option>
        <option value="IT">IT</option>
        <option value="FINANCE">FINANCE</option>
        <option value="CONTENTS">CONTENTS</option>
        <option value="GAME">GAME</option>
        <option value="LAW">LAW</option>
        <option value="MEDICAL">MEDICAL</option>
        <option value="CONSTRUCTION">CONSTRUCTION</option>
        <option value="MARKETING">MARKETING</option>
        <option value="LITERATURE">LITERATURE</option>
        <option value="ETC">ETC</option>
      </select>
      <button type="submit">제출</button>
      {errors.category && <p>{errors.category.message}</p>}
    </form>
  );
}

export default CategoryForm;
