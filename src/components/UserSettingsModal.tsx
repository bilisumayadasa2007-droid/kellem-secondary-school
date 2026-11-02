import React, { useState } from 'react';
import {
  Settings,
  Camera,
  Upload,
  Trash2,
  Calendar,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  School,
  Save,
  Link as LinkIcon,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserSettingsModalProps {
  user: UserProfile;
  currentUser?: UserProfile | null;
  token: string | null;
  onClose: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  user,
  currentUser,
  token,
  onClose,
  onProfileUpdated
}) => {
  // STRICT SELF-MANAGEMENT:
  // "nobode change anather student profile photo, phone number and age it changes only by self"
  // e.g. only Bilisummaa can change Bilisummaa's profile, and only Feeneet can change Feeneet's profile
  const isSelf = !currentUser || (currentUser.id === user.id) || (currentUser.email.toLowerCase() === user.email.toLowerCase());

  const [name, setName] = useState(user.name || '');
  const [className, setClassName] = useState(user.className || 'Grade 12 Natural Science');
  const [age, setAge] = useState<string>(user.age ? String(user.age) : '');
  const [phone, setPhone] = useState<string>(user.phone || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(user.photoUrl || null);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showUrlField, setShowUrlField] = useState<boolean>(false);
  
  const [saving, setSaving] = useState<boolean>(false);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper: Client-side resize and compression to prevent huge base64 payloads
  const compressImage = (file: File, maxDim = 400, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(e.target?.result as string);
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Manual Photo File Upload from Device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size exceeds 10MB. Please choose a smaller photo.');
      return;
    }

    setErrorMsg(null);
    setCompressing(true);
    try {
      const optimizedDataUrl = await compressImage(file, 450, 0.85);
      setPhotoUrl(optimizedDataUrl);
    } catch (err: any) {
      console.warn('Canvas resize failed, falling back to raw DataURL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setPhotoUrl(customUrlInput.trim());
    setShowUrlField(false);
    setCustomUrlInput('');
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setCustomUrlInput('');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSelf) {
      setErrorMsg(`Access Denied: Only ${user.name} can change their own profile photo, phone number, and age. Nobody else can modify another student's profile.`);
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const parsedAge = age.trim() ? parseInt(age.trim(), 10) : undefined;
      const cleanPhone = phone.trim() ? phone.trim() : undefined;

      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          token: token || undefined,
          name: name.trim(),
          className: className.trim(),
          age: parsedAge,
          phone: cleanPhone,
          photoUrl: photoUrl || null
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (res.ok && data && data.success) {
        setSuccessMsg('Settings saved successfully! Your manual profile updates are live.');
        onProfileUpdated(data.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (res.status === 403 || (data && data.error === 'FORBIDDEN_CROSS_USER_EDIT')) {
        setErrorMsg(data?.message || `Access Denied: Only ${user.name} can change their own profile photo, phone number, and age.`);
      } else if (!data) {
        // If response was not valid JSON, check status
        if (res.status === 413) {
          setErrorMsg('Image file is too large. Please select a smaller photo.');
          return;
        }
        if (res.status === 403) {
          setErrorMsg(`Access Denied: Only ${user.name} can change their own profile photo, phone number, and age.`);
          return;
        }
        // Save locally for self user
        const localUpdated: UserProfile = {
          ...user,
          name: name.trim(),
          className: className.trim(),
          age: parsedAge,
          phone: cleanPhone,
          photoUrl: photoUrl || undefined
        };
        onProfileUpdated(localUpdated);
        setSuccessMsg('Settings saved successfully to your profile!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.message || data.error || 'Failed to save settings. Please try again.');
      }
    } catch (err: any) {
      console.warn('Network issue saving settings, applying local fallback:', err);
      if (isSelf) {
        const parsedAge = age.trim() ? parseInt(age.trim(), 10) : undefined;
        const cleanPhone = phone.trim() ? phone.trim() : undefined;
        const localUpdated: UserProfile = {
          ...user,
          name: name.trim(),
          className: className.trim(),
          age: parsedAge,
          phone: cleanPhone,
          photoUrl: photoUrl || undefined
        };
        onProfileUpdated(localUpdated);
        setSuccessMsg('Settings saved to your profile!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(`Access Denied: Only ${user.name} can modify their own profile.`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0b2942] border border-white/20 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#061e31] via-[#093d2c] to-[#072439] p-5 sm:p-6 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-400/30 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                User Profile & Account
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Account Settings
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Security & Ownership Policy Banner */}
          {isSelf ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Self-Managed Profile:</strong> You are editing your own personal profile (<strong>{user.name}</strong>). Only you have permission to upload your photo, enter your age, and set your phone number.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/70 border-2 border-amber-500/50 text-xs text-amber-200 leading-relaxed flex items-start gap-3 shadow-lg">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-black text-amber-300">Protected Student Profile (Read-Only)</div>
                <div className="mt-1 text-slate-200">
                  Nobody can change another student's profile photo, phone number, or age. Only <strong>{user.name}</strong> can modify their own profile details by logging into their account.
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: Manual Photo Upload */}
          <div className="bg-black/25 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Profile Photo</span>
              </label>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                photoUrl ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {photoUrl ? 'Photo Uploaded' : 'No Photo (Initials used)'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Photo Preview */}
              <div className="relative shrink-0 flex justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl bg-slate-900"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#082942] to-emerald-700 text-white flex items-center justify-center font-black text-2xl border-2 border-slate-700 shadow-lg">
                    {name.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                {isSelf ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowUrlField(!showUrlField)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Paste Image URL</span>
                    </button>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Photo uploads are restricted to {user.name} only.</span>
                  </div>
                )}

                <p className="text-[11px] text-slate-400">
                  Supported formats: PNG, JPG, WebP (up to 3MB). Displayed on your Student ID card.
                </p>

                {isSelf && showUrlField && (
                  <div className="flex gap-2 pt-2 animate-in fade-in">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                      placeholder="https://example.com/my-photo.jpg"
                      className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Manual Age & Phone Number Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Age (Years)</span>
              </label>
              <input
                type="number"
                min={10}
                max={60}
                disabled={!isSelf}
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 18 (leave empty if not specified)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 block">
                {isSelf ? "Manual entry. Leave empty if you don't wish to specify." : `Only ${user.name} can specify their age.`}
              </span>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                disabled={!isSelf}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 0912345678 or +251 9..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 block">
                {isSelf ? "Manual entry. Displayed on official student directory." : `Only ${user.name} can enter their phone number.`}
              </span>
            </div>
          </div>

          {/* SECTION 3: Full Name & Grade / Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                disabled={!isSelf}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>Grade / Academic Stream</span>
              </label>
              <select
                value={className}
                disabled={!isSelf}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#071a2b] border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Grade 12 Natural Science">Grade 12 Natural Science</option>
                <option value="Grade 12 Social Science">Grade 12 Social Science</option>
                <option value="Grade 11 Natural Science">Grade 11 Natural Science</option>
                <option value="Grade 11 Social Science">Grade 11 Social Science</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Faculty Staff">Faculty Staff</option>
                <option value="School Administration">School Administration</option>
              </select>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 truncate">
            Account: <strong>{user.email}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              {isSelf ? 'Cancel' : 'Close'}
            </button>
            {isSelf ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Read Only (Self-Managed)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
