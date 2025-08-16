"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Search, 
  TrendingUp, 
  DollarSign,
  Users,
  MousePointer
} from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChannelData {
  channel: string;
  icon: any;
  sessions: number;
  revenue: number;
  conversions: number;
  cpa: number;
  roas: number;
  color: string;
  trend: number;
}

interface CampaignData {
  name: string;
  channel: string;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  ctr: number;
  status: 'active' | 'paused' | 'completed';
}

export function AdvancedMarketingAttribution() {
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedView, setSelectedView] = useState<'revenue' | 'sessions' | 'conversions'>('revenue');
  const { currency } = useSettings();

  useEffect(() => {
    // Mock marketing attribution data
    const mockChannels: ChannelData[] = [
      { 
        channel: "Google Ads", 
        icon: Search, 
        sessions: 15680, 
        revenue: 156800, 
        conversions: 892, 
        cpa: 175.8, 
        roas: 4.2, 
        color: "#4285F4",
        trend: 12.5
      },
      { 
        channel: "Facebook", 
        icon: Facebook, 
        sessions: 12450, 
        revenue: 89600, 
        conversions: 567, 
        cpa: 158.2, 
        roas: 3.1, 
        color: "#1877F2",
        trend: 8.3
      },
      { 
        channel: "Instagram", 
        icon: Instagram, 
        sessions: 9870, 
        revenue: 67800, 
        conversions: 445, 
        cpa: 152.4, 
        roas: 2.9, 
        color: "#E4405F",
        trend: 15.7
      },
      { 
        channel: "Email", 
        icon: Mail, 
        sessions: 7650, 
        revenue: 45600, 
        conversions: 234, 
        cpa: 194.9, 
        roas: 5.8, 
        color: "#34D399",
        trend: 6.2
      },
      { 
        channel: "YouTube", 
        icon: Youtube, 
        sessions: 5440, 
        revenue: 32400, 
        conversions: 178, 
        cpa: 182.0, 
        roas: 2.7, 
        color: "#FF0000",
        trend: 22.1
      },
      { 
        channel: "Twitter", 
        icon: Twitter, 
        sessions: 3210, 
        revenue: 18900, 
        conversions: 89, 
        cpa: 212.4, 
        roas: 1.8, 
        color: "#1DA1F2",
        trend: -4.2
      }
    ];

    const mockCampaigns: CampaignData[] = [
      { name: "Summer Sale 2025", channel: "Google Ads", spend: 15000, revenue: 67500, roas: 4.5, conversions: 234, ctr: 3.2, status: 'active' },
      { name: "Brand Awareness", channel: "Facebook", spend: 8900, revenue: 32100, roas: 3.6, conversions: 156, ctr: 2.8, status: 'active' },
      { name: "Product Launch", channel: "Instagram", spend: 12000, revenue: 48600, roas: 4.1, conversions: 189, ctr: 4.1, status: 'active' },
      { name: "Newsletter Campaign", channel: "Email", spend: 2400, revenue: 18900, roas: 7.9, conversions: 145, ctr: 12.5, status: 'active' },
      { name: "Video Marketing", channel: "YouTube", spend: 6700, revenue: 22800, roas: 3.4, conversions: 98, ctr: 1.9, status: 'paused' },
      { name: "Retargeting", channel: "Facebook", spend: 4500, revenue: 19800, roas: 4.4, conversions: 87, ctr: 5.6, status: 'completed' },
    ];

    setChannelData(mockChannels);
    setCampaigns(mockCampaigns);
  }, []);

  const getChannelValue = (channel: ChannelData) => {
    switch (selectedView) {
      case 'revenue': return channel.revenue;
      case 'sessions': return channel.sessions;
      case 'conversions': return channel.conversions;
      default: return channel.revenue;
    }
  };

  const pieChartData = {
    labels: channelData.map(c => c.channel),
    datasets: [
      {
        data: channelData.map(getChannelValue),
        backgroundColor: channelData.map(c => c.color),
        borderColor: channelData.map(c => c.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  const totalRevenue = channelData.reduce((sum, channel) => sum + channel.revenue, 0);
  const totalSessions = channelData.reduce((sum, channel) => sum + channel.sessions, 0);
  const totalConversions = channelData.reduce((sum, channel) => sum + channel.conversions, 0);
  const avgROAS = channelData.reduce((sum, channel) => sum + channel.roas, 0) / channelData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Marketing Attribution</h3>
            <p className="text-sm text-gray-500">Multi-channel campaign performance analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <div className="flex space-x-1">
            {(['revenue', 'sessions', 'conversions'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === view
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue / 1000, currency)}{totalRevenue >= 1000 ? 'K' : ''}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{(totalSessions / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <MousePointer className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{totalConversions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Conversions</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{avgROAS.toFixed(1)}x</div>
          <div className="text-sm text-gray-600">Avg. ROAS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Performance Chart */}
        <div className="lg:col-span-1">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Channel Distribution</h4>
          <div className="h-64">
            <Doughnut data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Channel Details */}
        <div className="lg:col-span-2">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Channel Performance Details</h4>
          <div className="space-y-3">
            {channelData.map((channel, index) => (
              <motion.div
                key={channel.channel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${channel.color}20` }}>
                    <channel.icon className="w-5 h-5" style={{ color: channel.color }} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{channel.channel}</div>
                    <div className="text-sm text-gray-500">
                      {channel.sessions.toLocaleString()} sessions • {channel.conversions} conversions
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(channel.revenue / 1000, currency)}{channel.revenue >= 1000 ? 'K' : ''}</div>
                    <div className="text-gray-500">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{channel.roas.toFixed(1)}x</div>
                    <div className="text-gray-500">ROAS</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(channel.cpa, currency)}</div>
                    <div className="text-gray-500">CPA</div>
                  </div>
                  <div className={`text-right ${channel.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-semibold">{channel.trend > 0 ? '+' : ''}{channel.trend}%</div>
                    <div className="text-gray-500">Trend</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="mt-8">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Active Campaigns</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Channel</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Spend</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">ROAS</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Conversions</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">CTR</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <motion.tr
                  key={campaign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="py-3 px-4 text-gray-600">{campaign.channel}</td>
                  <td className="py-3 px-4 text-center text-gray-900">{formatCurrency(campaign.spend, currency)}</td>
                  <td className="py-3 px-4 text-center text-gray-900">{formatCurrency(campaign.revenue, currency)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-semibold ${campaign.roas >= 3 ? 'text-green-600' : campaign.roas >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {campaign.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-900">{campaign.conversions}</td>
                  <td className="py-3 px-4 text-center text-gray-900">{campaign.ctr}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
