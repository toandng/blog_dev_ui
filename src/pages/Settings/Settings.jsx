import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";
import styles from "./Settings.module.scss";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import useUser from "../../hook/useUser";
import userService from "../../services/userService";

const Settings = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Settings State
  const [settings, setSettings] = useState({
    // Account
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,

    // Content
    defaultPostVisibility: "public",
    allowComments: true,
    requireCommentApproval: false,
    showViewCounts: true,

    // Notifications
    emailNewComments: true,
    emailNewLikes: true,
    emailNewFollowers: true,
    emailWeeklyDigest: true,
    pushNotifications: true,

    // Privacy
    profileVisibility: "public",
    allowDirectMessages: "everyone",
    searchEngineIndexing: true,
    showEmail: false,
  });

  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      const userSettings = JSON.parse(
        currentUser?.data?.settings?.data || null
      );

      setSettings((prev) => {
        return {
          // Account
          email: currentUser.data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          twoFactorEnabled:
            userSettings?.twoFactorEnabled || prev.twoFactorEnabled,

          // Content
          defaultPostVisibility:
            userSettings?.defaultPostVisibility || prev.defaultPostVisibility,
          allowComments: userSettings?.allowComments || prev.allowComments,
          requireCommentApproval:
            userSettings?.requireCommentApproval || prev.requireCommentApproval,
          showViewCounts: userSettings?.showViewCounts || prev.showViewCounts,

          // Notifications
          emailNewComments:
            userSettings?.emailNewComments || prev.emailNewComments,
          emailNewLikes: userSettings?.emailNewLikes || prev.emailNewLikes,
          emailNewFollowers:
            userSettings?.emailNewFollowers || prev.emailNewFollowers,
          emailWeeklyDigest:
            userSettings?.emailWeeklyDigest || prev.emailWeeklyDigest,
          pushNotifications:
            userSettings?.pushNotifications || prev.pushNotifications,

          // Privacy
          profileVisibility:
            userSettings?.profileVisibility || prev.profileVisibility,
          allowDirectMessages:
            userSettings?.allowDirectMessages || prev.allowDirectMessages,
          searchEngineIndexing:
            userSettings?.searchEngineIndexing || prev.searchEngineIndexing,
          showEmail: userSettings?.showEmail || prev.showEmail,
        };
      });
    }
  }, [currentUser]);

  const settingsSections = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ];

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (settings.newPassword !== settings.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(settings);
      toast.success("Password updated successfully!");
      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    console.log(settings);
    const { currentPassword, newPassword, confirmPassword, ...data } = settings;

    setLoading(true);
    try {
      await userService.settings(data);
      setMessage("Settings saved successfully!");
    } catch (error) {
      setMessage("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const exportData = {
        profile: { username: "john-doe", email: settings.email },
        settings: settings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-blog-data.json";
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Data exported successfully!");
    } catch (error) {
      setMessage("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const renderAccountSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Account Settings</h2>

      <div className={styles.settingGroup}>
        <h3>Email & Authentication</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Email Address</label>
            <span className={styles.settingDescription}>
              Your primary email for notifications
            </span>
          </div>
          <div className={styles.settingControl}>
            <Input
              value={settings.email}
              onChange={(e) => handleSettingChange("email", e.target.value)}
            />
            <Badge variant="success">Verified</Badge>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Two-Factor Authentication</label>
            <span className={styles.settingDescription}>
              Add extra security to your account
            </span>
          </div>
          <div className={styles.settingControl}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) =>
                  handleSettingChange("twoFactorEnabled", e.target.checked)
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
          <Input
            label="Current Password"
            type="password"
            value={settings.currentPassword}
            onChange={(e) =>
              handleSettingChange("currentPassword", e.target.value)
            }
            required
          />
          <Input
            label="New Password"
            type="password"
            value={settings.newPassword}
            onChange={(e) => handleSettingChange("newPassword", e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={settings.confirmPassword}
            onChange={(e) =>
              handleSettingChange("confirmPassword", e.target.value)
            }
            required
          />
          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Content & Publishing</h2>

      <div className={styles.settingGroup}>
        <h3>Default Settings</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Default Post Visibility</label>
            <span className={styles.settingDescription}>
              Choose default visibility for new posts
            </span>
          </div>
          <select
            value={settings.defaultPostVisibility}
            onChange={(e) =>
              handleSettingChange("defaultPostVisibility", e.target.value)
            }
            className={styles.selectInput}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Allow Comments</label>
            <span className={styles.settingDescription}>
              Let readers comment on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.allowComments}
              onChange={(e) =>
                handleSettingChange("allowComments", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Show View Counts</label>
            <span className={styles.settingDescription}>
              Display view counts on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.showViewCounts}
              onChange={(e) =>
                handleSettingChange("showViewCounts", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Notifications</h2>

      <div className={styles.settingGroup}>
        <h3>Email Notifications</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>New Comments</label>
            <span className={styles.settingDescription}>
              Get notified when someone comments on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailNewComments}
              onChange={(e) =>
                handleSettingChange("emailNewComments", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>New Followers</label>
            <span className={styles.settingDescription}>
              Get notified when someone follows you
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailNewFollowers}
              onChange={(e) =>
                handleSettingChange("emailNewFollowers", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Weekly Digest</label>
            <span className={styles.settingDescription}>
              Receive weekly summary of your activity
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailWeeklyDigest}
              onChange={(e) =>
                handleSettingChange("emailWeeklyDigest", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsContent}>
      <h2>Privacy & Security</h2>

      <div className={styles.settingGroup}>
        <h3>Profile Privacy</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Profile Visibility</label>
            <span className={styles.settingDescription}>
              Control who can see your profile
            </span>
          </div>
          <select
            value={settings.profileVisibility}
            onChange={(e) =>
              handleSettingChange("profileVisibility", e.target.value)
            }
            className={styles.selectInput}
          >
            <option value="public">Public</option>
            <option value="followers">Followers Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Search Engine Indexing</label>
            <span className={styles.settingDescription}>
              Allow search engines to index your content
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.searchEngineIndexing}
              onChange={(e) =>
                handleSettingChange("searchEngineIndexing", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Data Export</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Download Your Data</label>
            <span className={styles.settingDescription}>
              Export all your data in JSON format
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={handleExportData}
            loading={loading}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountSettings();
      case "content":
        return renderContentSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            ← Back
          </Button>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className={styles.settingsLayout}>
          <nav className={styles.sidebar}>
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className={`${styles.sidebarItem} ${
                  activeSection === section.id ? styles.active : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span className={styles.sidebarLabel}>{section.label}</span>
              </button>
            ))}
          </nav>

          <Card className={styles.mainContent}>
            {message && (
              <div className={styles.message}>
                {message}
                <button
                  onClick={() => setMessage("")}
                  className={styles.messageClose}
                >
                  ×
                </button>
              </div>
            )}
            {renderContent()}

            <div className={styles.saveActions}>
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
