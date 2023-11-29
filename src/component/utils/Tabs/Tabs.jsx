import React, { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div>
      <ul className='flex border-collapse'>
        {tabs.map((tab, index) => (
          <li
            key={index}
            onClick={() => {
              if(!tab.disabled)
                handleTabClick(index)
            }}
            className={"border border-gray-400 p-1 text-sm cursor-pointer" + ( activeTab === index ? ' font-bold' : '')}
          >
            {tab.title}
          </li>
        ))}
      </ul>
      <div>
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
