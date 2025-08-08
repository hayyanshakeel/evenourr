"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Settings, Zap } from "lucide-react";

interface CouponRule {
  id: string;
  type: 'customer_segment' | 'product_category' | 'order_amount' | 'date_range' | 'usage_limit';
  condition: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  description: string;
}

interface CouponRulesEngineProps {
  rules: CouponRule[];
  onRulesChange: (rules: CouponRule[]) => void;
}

export function CouponRulesEngine({ rules, onRulesChange }: CouponRulesEngineProps) {
  const [newRule, setNewRule] = useState<Partial<CouponRule>>({
    type: 'customer_segment',
    condition: 'equals',
    value: '',
  });

  const ruleTypes = [
    { value: 'customer_segment', label: 'Customer Segment', description: 'Target specific customer groups' },
    { value: 'product_category', label: 'Product Category', description: 'Apply to specific product categories' },
    { value: 'order_amount', label: 'Order Amount', description: 'Minimum or maximum order value' },
    { value: 'date_range', label: 'Date Range', description: 'Specific time periods' },
    { value: 'usage_limit', label: 'Usage Limit', description: 'Limit number of uses' }
  ];

  const conditions = {
    customer_segment: [
      { value: 'equals', label: 'Is' },
      { value: 'contains', label: 'Contains' }
    ],
    product_category: [
      { value: 'equals', label: 'Is' },
      { value: 'contains', label: 'Contains' }
    ],
    order_amount: [
      { value: 'greater_than', label: 'Greater than' },
      { value: 'less_than', label: 'Less than' },
      { value: 'between', label: 'Between' }
    ],
    date_range: [
      { value: 'between', label: 'Between' }
    ],
    usage_limit: [
      { value: 'less_than', label: 'Less than' },
      { value: 'equals', label: 'Exactly' }
    ]
  };

  const addRule = () => {
    if (newRule.type && newRule.condition && newRule.value) {
      const rule: CouponRule = {
        id: Date.now().toString(),
        type: newRule.type as CouponRule['type'],
        condition: newRule.condition as CouponRule['condition'],
        value: newRule.value,
        description: generateRuleDescription(newRule as CouponRule)
      };
      
      onRulesChange([...rules, rule]);
      setNewRule({ type: 'customer_segment', condition: 'equals', value: '' });
    }
  };

  const removeRule = (ruleId: string) => {
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
  };

  const generateRuleDescription = (rule: CouponRule): string => {
    const ruleType = ruleTypes.find(t => t.value === rule.type)?.label;
    const condition = conditions[rule.type]?.find(c => c.value === rule.condition)?.label;
    return `${ruleType} ${condition} ${rule.value}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Advanced Rules Engine
        </CardTitle>
        <CardDescription>
          Create complex conditions for when this coupon should apply
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Existing Rules */}
        {rules.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Active Rules</Label>
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{ruleTypes.find(t => t.value === rule.type)?.label}</Badge>
                  <span className="text-sm">{rule.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(rule.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Rule */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Label className="text-sm font-medium">Add New Rule</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select
                value={newRule.type}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value as CouponRule['type'], condition: 'equals' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule-condition">Condition</Label>
              <Select
                value={newRule.condition}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, condition: value as CouponRule['condition'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {newRule.type && conditions[newRule.type]?.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule-value">Value</Label>
              {newRule.type === 'customer_segment' ? (
                <Select
                  value={newRule.value}
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_users">New Users</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="inactive">Inactive Customers</SelectItem>
                    <SelectItem value="high_value">High Value Customers</SelectItem>
                  </SelectContent>
                </Select>
              ) : newRule.type === 'product_category' ? (
                <Select
                  value={newRule.value}
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={newRule.value}
                  onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={
                    newRule.type === 'order_amount' ? 'Enter amount' :
                    newRule.type === 'usage_limit' ? 'Enter limit' :
                    'Enter value'
                  }
                  type={newRule.type === 'order_amount' || newRule.type === 'usage_limit' ? 'number' : 'text'}
                />
              )}
            </div>
          </div>

          <Button onClick={addRule} size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        {/* Rules Preview */}
        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No rules configured</p>
            <p className="text-sm">Add rules to create conditional logic for this coupon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
