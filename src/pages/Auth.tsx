
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent } from "@/components/ui/card";

const Auth = () => {
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-monochrome-200">
          <CardContent className="pt-6">
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
