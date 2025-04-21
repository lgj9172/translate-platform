import React from "react";

function CustomerSupport() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <h3 className="text-lg font-bold text-gray-800">플루언스 고객센터</h3>
        <p className="mt-1 text-2xl font-bold text-orange-500">070-8383-6353</p>
      </div>
      <div className="mt-4 md:mt-0 md:w-1/2 space-y-2 text-sm text-gray-600">
        <p className="grid grid-cols-[100px,1fr]">
          <span className="text-gray-500">운영시간</span>
          <span>09:00 - 18:00</span>
        </p>
        <p className="grid grid-cols-[100px,1fr]">
          <span className="text-gray-500">점심시간</span>
          <span>12:00 - 13:00</span>
        </p>
        <p className="grid grid-cols-[100px,1fr]">
          <span className="text-gray-500">휴무안내</span>
          <span>주말 및 공휴일</span>
        </p>
      </div>
    </div>
  );
}

export default CustomerSupport;
