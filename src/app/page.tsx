"use client"

import { useState, useEffect } from "react"
import { Plus, Wallet, Calendar, DollarSign, ShoppingBag, Home, Car, Utensils, Heart, Smartphone, X, Check, ArrowRight, ChevronRight, Globe, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

type UserProfile = {
  name: string
  email: string
  financialGoal: string
  monthlyIncome: string
  monthlyExpense: string
  hasDebt: string
  currency: string
}

const financialGoals = [
  { id: "save", label: "Economizar dinheiro", emoji: "💰" },
  { id: "invest", label: "Começar a investir", emoji: "📈" },
  { id: "debt", label: "Pagar dívidas", emoji: "💳" },
  { id: "control", label: "Controlar gastos", emoji: "📊" },
]

const currencies = [
  { id: "BRL", label: "Real Brasileiro", symbol: "R$", flag: "🇧🇷" },
  { id: "USD", label: "Dólar Americano", symbol: "$", flag: "🇺🇸" },
  { id: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { id: "GBP", label: "Libra Esterlina", symbol: "£", flag: "🇬🇧" },
  { id: "JPY", label: "Iene Japonês", symbol: "¥", flag: "🇯🇵" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    financialGoal: "",
    monthlyIncome: "",
    monthlyExpense: "",
    hasDebt: "",
    currency: "BRL"
  })

  const [accountForm, setAccountForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const [loginError, setLoginError] = useState("")

  // Garantir que está no cliente antes de acessar localStorage
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar se já completou onboarding
  useEffect(() => {
    if (!isClient) return
    
    const completed = localStorage.getItem("onboardingCompleted")
    if (completed === "true") {
      setShouldRedirect(true)
    }
  }, [isClient])

  // Fazer redirect separadamente
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/dashboard")
    }
  }, [shouldRedirect, router])

  const completeOnboarding = () => {
    if (!isClient) return
    
    const profile = {
      ...userProfile,
      name: accountForm.fullName,
      email: accountForm.email
    }
    
    // Salvar credenciais de login
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    users.push({
      email: accountForm.email,
      password: accountForm.password,
      profile: profile
    })
    localStorage.setItem("users", JSON.stringify(users))
    
    localStorage.setItem("onboardingCompleted", "true")
    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("userCurrency", userProfile.currency)
    localStorage.setItem("currentUserEmail", accountForm.email)
    
    setShouldRedirect(true)
  }

  const handleLogin = () => {
    if (!isClient) return
    
    setLoginError("")
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === loginForm.email && u.password === loginForm.password)
    
    if (user) {
      localStorage.setItem("onboardingCompleted", "true")
      localStorage.setItem("userProfile", JSON.stringify(user.profile))
      localStorage.setItem("userCurrency", user.profile.currency)
      localStorage.setItem("currentUserEmail", user.email)
      
      setShouldRedirect(true)
    } else {
      setLoginError("E-mail ou senha incorretos")
    }
  }

  // Não renderizar até estar no cliente
  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm shadow-2xl border-slate-700">
        <div className="p-8">
          {/* Tela de Login */}
          {showLogin ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Entrar na sua conta
                </h1>
                <p className="text-gray-400">
                  Acesse sua conta existente
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-gray-300">E-mail</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="h-12 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-gray-300">Senha</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    placeholder="Digite sua senha"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="h-12 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-sm text-red-400 text-center">{loginError}</p>
              )}

              <Button
                onClick={handleLogin}
                disabled={!loginForm.email || !loginForm.password}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-lg"
              >
                Entrar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Não tem uma conta? <span className="text-purple-400 font-semibold">Criar conta</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Indicador de Progresso */}
              {onboardingStep > 0 && (
                <div className="flex gap-2 mb-8">
                  {[0, 1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        step <= onboardingStep
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Passo 0: Bem-vindo */}
              {onboardingStep === 0 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Bem-vindo ao Meu Dinheiro
                    </h1>
                    <p className="text-gray-400">
                      Vamos conhecer você melhor para personalizar sua experiência
                    </p>
                  </div>
                  <Button
                    onClick={() => setOnboardingStep(1)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-lg"
                  >
                    Começar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowLogin(true)}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
                    >
                      <LogIn className="w-4 h-4" />
                      Já tem uma conta? <span className="text-purple-400 font-semibold">Fazer login</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Passo 1: Moeda */}
              {onboardingStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Qual moeda você usa?
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Selecione sua moeda principal
                    </p>
                  </div>
                  <div className="space-y-3">
                    {currencies.map((currency) => (
                      <button
                        key={currency.id}
                        onClick={() => setUserProfile({ ...userProfile, currency: currency.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                          userProfile.currency === currency.id
                            ? "border-purple-500 bg-purple-900/30"
                            : "border-slate-700 hover:border-purple-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="text-3xl">{currency.flag}</span>
                        <div className="flex-1">
                          <span className="font-semibold text-white block">{currency.label}</span>
                          <span className="text-sm text-gray-400">{currency.symbol}</span>
                        </div>
                        {userProfile.currency === currency.id && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setOnboardingStep(2)}
                    disabled={!userProfile.currency}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Passo 2: Meta Financeira */}
              {onboardingStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Qual é sua principal meta financeira?
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Isso nos ajuda a dar dicas personalizadas
                    </p>
                  </div>
                  <div className="space-y-3">
                    {financialGoals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setUserProfile({ ...userProfile, financialGoal: goal.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                          userProfile.financialGoal === goal.id
                            ? "border-purple-500 bg-purple-900/30"
                            : "border-slate-700 hover:border-purple-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="text-3xl">{goal.emoji}</span>
                        <span className="font-semibold text-white">{goal.label}</span>
                        {userProfile.financialGoal === goal.id && (
                          <Check className="w-5 h-5 text-purple-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setOnboardingStep(1)}
                      variant="outline"
                      className="flex-1 h-12 border-slate-700 text-gray-300 hover:bg-slate-800"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setOnboardingStep(3)}
                      disabled={!userProfile.financialGoal}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    >
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Passo 3: Renda Mensal */}
              {onboardingStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Qual sua renda mensal aproximada?
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Não precisa ser exato, uma estimativa já ajuda
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: "0-2000", label: "Até R$ 2.000" },
                      { id: "2000-5000", label: "R$ 2.000 - R$ 5.000" },
                      { id: "5000-10000", label: "R$ 5.000 - R$ 10.000" },
                      { id: "10000+", label: "Acima de R$ 10.000" },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setUserProfile({ ...userProfile, monthlyIncome: range.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                          userProfile.monthlyIncome === range.id
                            ? "border-purple-500 bg-purple-900/30"
                            : "border-slate-700 hover:border-purple-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="font-semibold text-white">{range.label}</span>
                        {userProfile.monthlyIncome === range.id && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setOnboardingStep(2)}
                      variant="outline"
                      className="flex-1 h-12 border-slate-700 text-gray-300 hover:bg-slate-800"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setOnboardingStep(4)}
                      disabled={!userProfile.monthlyIncome}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    >
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Passo 4: Gastos Mensais */}
              {onboardingStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Quanto você gasta por mês?
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Considere todas suas despesas mensais
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: "0-1000", label: "Até R$ 1.000" },
                      { id: "1000-3000", label: "R$ 1.000 - R$ 3.000" },
                      { id: "3000-7000", label: "R$ 3.000 - R$ 7.000" },
                      { id: "7000+", label: "Acima de R$ 7.000" },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setUserProfile({ ...userProfile, monthlyExpense: range.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                          userProfile.monthlyExpense === range.id
                            ? "border-purple-500 bg-purple-900/30"
                            : "border-slate-700 hover:border-purple-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="font-semibold text-white">{range.label}</span>
                        {userProfile.monthlyExpense === range.id && (
                          <Check className="w-5 h-5 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setOnboardingStep(3)}
                      variant="outline"
                      className="flex-1 h-12 border-slate-700 text-gray-300 hover:bg-slate-800"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setOnboardingStep(5)}
                      disabled={!userProfile.monthlyExpense}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    >
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Passo 5: Dívidas */}
              {onboardingStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Você tem dívidas?
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Cartão de crédito, empréstimos, financiamentos...
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: "no", label: "Não tenho dívidas", emoji: "✅" },
                      { id: "small", label: "Tenho algumas dívidas pequenas", emoji: "⚠️" },
                      { id: "medium", label: "Tenho dívidas consideráveis", emoji: "🔴" },
                      { id: "high", label: "Estou muito endividado", emoji: "🚨" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setUserProfile({ ...userProfile, hasDebt: option.id })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                          userProfile.hasDebt === option.id
                            ? "border-purple-500 bg-purple-900/30"
                            : "border-slate-700 hover:border-purple-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="font-semibold text-white">{option.label}</span>
                        {userProfile.hasDebt === option.id && (
                          <Check className="w-5 h-5 text-purple-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setOnboardingStep(4)}
                      variant="outline"
                      className="flex-1 h-12 border-slate-700 text-gray-300 hover:bg-slate-800"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={() => setOnboardingStep(6)}
                      disabled={!userProfile.hasDebt}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    >
                      Continuar
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Passo 6: Criar Conta */}
              {onboardingStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Crie sua conta
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Seus dados estão seguros e protegidos
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-300">Nome Completo</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="João Silva"
                        value={accountForm.fullName}
                        onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                        className="h-12 bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="h-12 bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={accountForm.password}
                        onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                        className="h-12 bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={accountForm.confirmPassword}
                        onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                        className="h-12 bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  {accountForm.password && accountForm.confirmPassword && accountForm.password !== accountForm.confirmPassword && (
                    <p className="text-sm text-red-400">As senhas não coincidem</p>
                  )}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setOnboardingStep(5)}
                      variant="outline"
                      className="flex-1 h-12 border-slate-700 text-gray-300 hover:bg-slate-800"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={completeOnboarding}
                      disabled={
                        !accountForm.fullName ||
                        !accountForm.email ||
                        !accountForm.password ||
                        accountForm.password !== accountForm.confirmPassword ||
                        accountForm.password.length < 6
                      }
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                    >
                      Criar Conta
                      <Check className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
