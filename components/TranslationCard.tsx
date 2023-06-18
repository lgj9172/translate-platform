import PPTIcon from "@assets/icons/ppt.svg";
import { NumericFormat } from "react-number-format";
import {
  getCategoryLabel,
  getDday,
  getLanguageLabel,
} from "@/utils/converter/label";
import { Translation } from "@/apis/translations";
import Badge from "./Badge";
import Typography from "./Typography";

interface TranslationCardProps {
  translation: Translation;
}

export default function TranslationCard({
  translation: {
    categories,
    language,
    end_time,
    desired_fee,
    title,
    description,
    file,
    quantity,
    quotations,
  },
}: TranslationCardProps) {
  return (
    <button type="button" className="p-[20px]">
      <div className="mb-[12px] flex justify-between">
        <div className="flex gap-[4px]">
          {categories.map((category) => (
            <Badge color="blue">{getCategoryLabel(category)}</Badge>
          ))}
          <Badge color="black">
            {`${getLanguageLabel(language.source)[0]}${
              getLanguageLabel(language.target)[0]
            }`}
          </Badge>
          <Badge color="red">{getDday(end_time)}</Badge>
        </div>
        <Typography type="body-16" bold>
          <span className="text-primary">
            <NumericFormat
              displayType="text"
              value={desired_fee.value}
              thousandsGroupStyle="thousand"
              thousandSeparator=","
            />
            <span>
              {desired_fee.unit === "KRW" && "원"}
              {desired_fee.unit === "USD" && "달러"}
            </span>
          </span>
        </Typography>
      </div>

      <div className="mb-[4px]">
        <Typography type="body-16">{title}</Typography>
      </div>

      <div className="mb-[12px] text-[#7B7B7B]">
        <Typography type="body-14">{description}</Typography>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-[#4D4D4D]">
          <Typography type="body-14">
            <div className="flex items-center gap-2">
              {file.type === "PPT" ? <PPTIcon /> : ""}
              <span>
                <NumericFormat
                  displayType="text"
                  value={quantity.value}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                />{" "}
                {quantity.unit === "CHAR" && "글자"}
                {quantity.unit === "WORD" && "단어"}
              </span>
            </div>
          </Typography>
        </div>

        <Typography type="body-14">
          <div className="flex gap-[4px] justify-center items-center">
            <span>받은 견적</span>
            <span>{quotations}</span>
          </div>
        </Typography>
      </div>
    </button>
  );
}
