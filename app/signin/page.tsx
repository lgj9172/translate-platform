export default function Signin() {
  return (
    <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
      <div>
        <div className="mb-[40px] flex flex-col items-center">
          <p>투명한 가격비교</p>
          <p>검증된 번역사</p>
        </div>
        <div className="flex flex-col justify-center items-stretch gap-3">
          <button
            type="button"
            className="w-[327px] py-[16px] bg-[#03C75A] rounded-[8px] font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#FFFFFF]"
          >
            네이버로 시작하기
          </button>
          <button
            type="button"
            className="w-[327px] py-[16px] bg-[#F9E000] rounded-[8px] font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#000000]"
          >
            카카오톡으로 시작하기
          </button>
          <button
            type="button"
            className="w-[327px] py-[16px] bg-[#000000] rounded-[8px] font-[700] text-[16px] leading-[24px] tracking-[-0.004em] text-[#FFFFFF]"
          >
            애플로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
