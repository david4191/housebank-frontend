import { useRef, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { useGetMyProfileQuery, useUploadMyAvatarMutation } from '../../../redux/housebank.ts';

function avatarUrl(relativePath: string | null | undefined) {
  if (!relativePath) return null;
  return `${import.meta.env.VITE_APP_BACKEND_HOST}${relativePath}`;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Self-contained profile-picture uploader. Reads the current avatar off
 * GET /profile/me and posts a new one to POST /profile/me/avatar itself
 * (both requests carry the caller's own auth token), so any settings
 * page — customer, agent, or company — can drop this in with zero
 * props; the backend resolves which profile table's avatar_path/
 * logo_path to write from the caller's role.
 */
const AvatarUpload = () => {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [uploadAvatar, { isLoading: uploading }] = useUploadMyAvatarMutation();
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Company profiles store this under logo_path, not avatar_path (see
  // GET /profile/me's company branch in profile.routes.js) -- falling
  // back keeps this one component usable for all three roles without
  // the caller needing to know which field name applies.
  const currentAvatar =
    preview || avatarUrl(profile?.profile?.avatar_path || profile?.profile?.logo_path);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('avatar', file);
    const result: any = await uploadAvatar(formData);
    if (result.error) {
      const err = result.error;
      setError(err?.errors?.avatar?.[0] || err?.message || 'Could not upload image.');
      setPreview(null);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
        {currentAvatar ? (
          <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Change photo'}
        </button>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG or WEBP. Max 5MB.</p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
