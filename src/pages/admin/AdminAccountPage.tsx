import { useState } from "react";
import { UserPlus, CheckCircle } from "lucide-react";
import { useSignUpMutation } from "@/api/auth/mutations";
import styles from "./AdminAccountPage.module.css";

interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  nickname?: string;
}

export const AdminAccountPage = () => {
  const signUpMutation = useSignUpMutation();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 에러 초기화
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검사
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      newErrors.password = "비밀번호는 8~20자로 입력해주세요";
    }

    // 비밀번호 확인 검사
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    // 이름 검사
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    } else if (formData.name.length < 2 || formData.name.length > 20) {
      newErrors.name = "이름은 2~20자로 입력해주세요";
    }

    // 닉네임 검사
    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요";
    } else if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 2~20자로 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    await signUpMutation.mutateAsync({
      email: formData.email.trim(),
      password: formData.password,
      name: formData.nickname,
      nickname: formData.nickname.trim(),
    });

    // 성공 시 폼 초기화
    setFormData({
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      nickname: "",
    });
    setSuccessMessage(`"${formData.nickname}" 계정이 생성되었습니다.`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <UserPlus size={32} />
        </div>
        <h1 className={styles.title}>계정 생성</h1>
        <p className={styles.description}>새로운 관리자 계정을 생성합니다.</p>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            <CheckCircle size={20} />
            <p>{successMessage}</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              이메일
              <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              비밀번호
              <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`${styles.input} ${errors.password ? styles.error : ""}`}
              placeholder="8~20자"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password ? (
              <span className={styles.errorText}>{errors.password}</span>
            ) : (
              <span className={styles.helperText}>
                영문, 숫자를 포함한 8~20자
              </span>
            )}
          </div>

          {/* Password Confirm */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              비밀번호 확인
              <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              className={`${styles.input} ${errors.passwordConfirm ? styles.error : ""}`}
              placeholder="비밀번호 재입력"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
            {errors.passwordConfirm && (
              <span className={styles.errorText}>{errors.passwordConfirm}</span>
            )}
          </div>

          {/* name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              이름
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              placeholder="2~20자"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name ? (
              <span className={styles.errorText}>{errors.name}</span>
            ) : (
              <span className={styles.helperText}>2~20자의 이름</span>
            )}
          </div>

          {/* Nickname */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              닉네임
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="nickname"
              className={`${styles.input} ${errors.nickname ? styles.error : ""}`}
              placeholder="2~20자"
              value={formData.nickname}
              onChange={handleChange}
            />
            {errors.nickname ? (
              <span className={styles.errorText}>{errors.nickname}</span>
            ) : (
              <span className={styles.helperText}>2~20자의 닉네임</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={signUpMutation.isPending}
          >
            <UserPlus size={20} />
            {signUpMutation.isPending ? "생성 중..." : "계정 생성"}
          </button>
        </form>
      </div>
    </div>
  );
};
