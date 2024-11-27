import React,{ useState} from 'react'
import MainSettingView from '../../Components/MainSettingView';
import LeftSettingMenu from '../../Components/LeftSettingMenu';
import assets from '../../assets/assets';

export default function Settings() {
  const [selectedSetting, setSelectedSetting] = useState(null); // State to hold selected setting data

  // Handle setting selection
  const settings = [
    {
      id: 1,
      name: 'Personal Information',
      pic: assets.settingicon ,
    },
    // Add more settings if needed
  ];
  const handleUserSelect = (setting) => {
    setSelectedSetting(setting); // Update state with selected setting
  };

  return (
    <div className="d-f jc-c ai-c mainChat">
      <div className="d-f fd-r main-chat-container">
        {/* Passing the handleUserSelect function to LeftSettingMenu */}
      <LeftSettingMenu settings={settings} onSettingSelect={handleUserSelect} />
      
      {/* Passing the selected setting to MainSettingView */}
      <MainSettingView selectedSetting={selectedSetting} />
      </div>
    </div>
  );
}
