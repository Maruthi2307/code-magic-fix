import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VehicleData {
  type: string;
  number: string;
  customType?: string;
}

interface FormData {
  personalInfo: {
    name: string;
    phone: string;
    age: number;
    gender: string;
    city: string;
    state: string;
    email?: string;
    drivingExperience?: string;
    routePreference?: string;
  };
  vehicles: VehicleData[];
  profilePicture?: string;
  registrationDate: string;
}

const TrafficRegistration = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    ownerName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    email: '',
    drivingExperience: '',
    routePreference: '',
    vehicles: {
      bike: { checked: false, number: '' },
      car: { checked: false, number: '' },
      sixWheeler: { checked: false, number: '' },
      others: { checked: false, number: '', type: '' }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (vehicleType: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      vehicles: {
        ...prev.vehicles,
        [vehicleType]: {
          ...prev.vehicles[vehicleType as keyof typeof prev.vehicles],
          [field]: value
        }
      }
    }));
  };

  const selectGender = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ['ownerName', 'phoneNumber', 'age', 'city', 'state', 'gender'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Check if at least one vehicle is selected
    const hasVehicle = Object.values(formData.vehicles).some(vehicle => vehicle.checked);
    if (!hasVehicle) {
      toast({
        title: "Validation Error",
        description: "Please select at least one vehicle type",
        variant: "destructive"
      });
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const collectFormData = (): FormData => {
    const vehicles: VehicleData[] = [];
    
    Object.entries(formData.vehicles).forEach(([type, data]) => {
      if (data.checked) {
        const vehicleData: VehicleData = {
          type,
          number: data.number || ''
        };
        
        if (type === 'others' && 'type' in data) {
          vehicleData.customType = data.type;
        }
        
        vehicles.push(vehicleData);
      }
    });

    return {
      personalInfo: {
        name: formData.ownerName,
        phone: formData.phoneNumber,
        age: parseInt(formData.age),
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        email: formData.email || undefined,
        drivingExperience: formData.drivingExperience || undefined,
        routePreference: formData.routePreference || undefined
      },
      vehicles,
      profilePicture: profilePicPreview || undefined,
      registrationDate: new Date().toISOString()
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = collectFormData();
      console.log('User Registration Data:', userData);
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to Traffic Simulator! Your profile has been created.",
      });
      
      setShowSuccess(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const startSimulation = () => {
    // Redirect to the Indian Road Digital Twin
    window.open('https://mamathabandi467-droid.github.io/indian-road-digital-twin/', '_blank');
  };

  if (showSuccess) {
    return (
      <div className="traffic-app-container p-1">
        <div className="traffic-header">
          <div className="traffic-app-icon relative z-10">🚦</div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Traffic Simulator</h1>
          <p className="text-lg opacity-90 relative z-10">Smart Traffic Management System</p>
        </div>
        
        <div className="text-center p-8">
          <div className="traffic-success-icon">✅</div>
          <h2 className="text-2xl font-bold text-traffic-success mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-8">Welcome to Traffic Simulator! Your profile has been created successfully.</p>
          <button 
            onClick={startSimulation}
            className="traffic-submit-btn"
          >
            🚦 Launch Traffic Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="traffic-app-container p-1">
      <div className="traffic-header">
        <div className="traffic-app-icon relative z-10">🚦</div>
        <h1 className="text-3xl font-bold mb-2 relative z-10">Traffic Simulator</h1>
        <p className="text-lg opacity-90 relative z-10">Smart Traffic Management System</p>
      </div>

      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Personal Information */}
          <div>
            <label className="block mb-3 font-semibold text-gray-700">
              Vehicle Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className="traffic-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="traffic-input"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            <div>
              <label className="block mb-3 font-semibold text-gray-700">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="traffic-input"
                placeholder="Age"
                min="18"
                max="100"
                required
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block mb-4 font-semibold text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'male', icon: '👨', label: 'Male' },
                { value: 'female', icon: '👩', label: 'Female' },
                { value: 'other', icon: '🧑', label: 'Other' }
              ].map((gender) => (
                <div
                  key={gender.value}
                  className={`traffic-gender-item ${formData.gender === gender.value ? 'checked' : ''}`}
                  onClick={() => selectGender(gender.value)}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender.value}
                    checked={formData.gender === gender.value}
                    onChange={() => selectGender(gender.value)}
                    required
                  />
                  <div className="traffic-gender-content text-center">
                    <div className="text-3xl mb-2">{gender.icon}</div>
                    <div className="font-medium text-sm">{gender.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <label className="block mb-4 font-semibold text-gray-700">
              Vehicle Information <span className="text-red-500">*</span>
            </label>
            
            {[
              { key: 'bike', icon: '🏍️', title: 'Two Wheeler (Bike/Scooter)', placeholder: 'Enter bike registration number (e.g., AP29XX1234)' },
              { key: 'car', icon: '🚗', title: 'Four Wheeler (Car)', placeholder: 'Enter car registration number (e.g., AP29XX1234)' },
              { key: 'sixWheeler', icon: '🚚', title: 'Heavy Vehicle (6 Wheeler/Truck)', placeholder: 'Enter vehicle registration number' },
              { key: 'others', icon: '🚐', title: 'Other Vehicles (Auto/Bus/Others)', placeholder: 'Enter vehicle registration number' }
            ].map((vehicle) => (
              <div key={vehicle.key} className="traffic-vehicle-section">
                <div className="font-bold text-gray-700 mb-4 flex items-center gap-3">
                  <span className="text-xl">{vehicle.icon}</span>
                  {vehicle.title}
                </div>
                <div className="flex items-center mb-4">
                  <div className="traffic-checkbox mr-4">
                    <input
                      type="checkbox"
                      checked={formData.vehicles[vehicle.key as keyof typeof formData.vehicles].checked}
                      onChange={(e) => handleVehicleChange(vehicle.key, 'checked', e.target.checked)}
                    />
                    <div className="traffic-checkbox-design"></div>
                  </div>
                  <label className="font-medium text-gray-700 flex-grow cursor-pointer">
                    I own a {vehicle.title.split('(')[1]?.replace(')', '') || vehicle.title}
                  </label>
                </div>
                <div className={`traffic-vehicle-number-input ${formData.vehicles[vehicle.key as keyof typeof formData.vehicles].checked ? 'show' : ''}`}>
                  <input
                    type="text"
                    value={formData.vehicles[vehicle.key as keyof typeof formData.vehicles].number}
                    onChange={(e) => handleVehicleChange(vehicle.key, 'number', e.target.value)}
                    className="traffic-input mb-2"
                    placeholder={vehicle.placeholder}
                  />
                  {vehicle.key === 'others' && (
                    <input
                      type="text"
                      value={'type' in formData.vehicles.others ? formData.vehicles.others.type : ''}
                      onChange={(e) => handleVehicleChange('others', 'type', e.target.value)}
                      className="traffic-input"
                      placeholder="Specify vehicle type (e.g., Auto Rickshaw, Bus)"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="traffic-input"
                placeholder="Your city"
                required
              />
            </div>
            <div>
              <label className="block mb-3 font-semibold text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="traffic-input cursor-pointer"
                required
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Driving Experience</label>
              <select
                value={formData.drivingExperience}
                onChange={(e) => handleInputChange('drivingExperience', e.target.value)}
                className="traffic-input cursor-pointer"
              >
                <option value="">Select Experience</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Preferred Route Type</label>
              <select
                value={formData.routePreference}
                onChange={(e) => handleInputChange('routePreference', e.target.value)}
                className="traffic-input cursor-pointer"
              >
                <option value="">Select Preference</option>
                <option value="highway">Highway Routes</option>
                <option value="city">City Roads</option>
                <option value="rural">Rural Roads</option>
                <option value="mixed">Mixed Routes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="traffic-input"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block mb-4 font-semibold text-gray-700">Profile Picture (Optional)</label>
            <div className="text-center">
              <div 
                className="traffic-profile-pic-preview mx-auto mb-4"
                onClick={() => document.getElementById('profilePic')?.click()}
              >
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile Preview" />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-2">📷</div>
                    <small className="text-gray-500">Tap to add photo</small>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profilePic"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              <small className="text-gray-500">Upload a clear photo for better experience</small>
            </div>
          </div>

          <button
            type="submit"
            className="traffic-submit-btn mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="traffic-loading mr-2"></span>
                Processing Registration...
              </>
            ) : (
              'Complete Registration & Start Simulation'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrafficRegistration;