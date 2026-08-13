export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l3vpncisco.png" alt="contoh gambar case 0">
<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
hostname PE1
<span class="cmd-bold">
# ================================
# MPLS &amp; ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0010.0100.1001.00
 is-type level-2-only
 metric-style wide
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 10.10.10.1 255.255.255.252
 description P1-Gi1
 ip router isis CORE
 mpls ip

interface GigabitEthernet2
 no shut
 ip address 11.11.11.1 255.255.255.252
 description P2-E1/0/0
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
 ip router isis CORE
<span class="cmd-bold">
# ================================
# VRF CONFIGURATION
# ================================
</span>
ip vrf CUST-A
 rd 65000:1
 route-target export 65000:100
 route-target import 65000:100
<span class="cmd-bold">
# ================================
# CUSTOMER INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet3
 no shut
 ip vrf forwarding CUST-A
 ip address 192.168.10.1 255.255.255.252
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
router bgp 65000
 neighbor 4.4.4.4 remote-as 65000
 neighbor 4.4.4.4 update-source Lo0

 address-family vpnv4
  neighbor 4.4.4.4 activate
  neighbor 4.4.4.4 send-community extended
 exit-address-family

 address-family ipv4 vrf CUST-A
  redistribute connected
 exit-address-family
<span class="cmd-green">
# ================================
# P1 CONFIGURATION 
# ================================
</span>
hostname P1
<span class="cmd-bold">
# ================================
# MPLS &amp; ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0020.0200.2002.00
 is-type level-2-only
 metric-style wide
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 10.10.10.2 255.255.255.252
 description PE1-Gi1
 ip router isis CORE
 mpls ip

interface GigabitEthernet2
 no shut
 ip address 12.12.12.1 255.255.255.252
 description PE2-Gi1
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 2.2.2.2 255.255.255.255
 ip router isis CORE
<span class="cmd-green">
# ================================
#  CONFIGURATION P2
# ================================
</span>
sysname P2
<span class="cmd-bold">
# ================================
# MPLS &amp; ROUTER-ID CONFIGURATION
# ================================
</span>
mpls lsr-id 3.3.3.3
mpls
mpls l2vpn
mpls ldp
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 network-entity 49.0001.0030.0300.3003.00
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 undo shutdown
 ip address 11.11.11.2 255.255.255.252
 description PE1-Gi1
 isis enable 1
 mpls
 mpls ldp

interface Ethernet1/0/1
 undo shutdown
 ip address 13.13.13.1 255.255.255.252
 description PE2-Gi2
 isis enable 1
 mpls
 mpls ldp
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 3.3.3.3 255.255.255.255
 isis enable 1
<span class="cmd-green">
# ================================
# PE2 CONFIGURATION 
# ================================
</span>
hostname PE2
<span class="cmd-bold">
# ================================
# MPLS &amp; ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0040.0400.4004.00
 is-type level-2-only
 metric-style wide
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 ip address 12.12.12.2 255.255.255.252
 description PE1-Gi2
 ip router isis CORE
 mpls ip

interface GigabitEthernet2
 no shut
 ip address 13.13.13.2 255.255.255.252
 description P2-E1/0/1
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 4.4.4.4 255.255.255.255
 ip router isis CORE
<span class="cmd-bold">
# ================================
# VRF CONFIGURATION
# ================================
</span>
ip vrf CUST-A
 rd 65000:1
 route-target export 65000:100
 route-target import 65000:100
<span class="cmd-bold">
# ================================
# CUSTOMER INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet3
 no shut
 ip vrf forwarding CUST-A
 ip address 192.168.20.1 255.255.255.252
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
router bgp 65000
 neighbor 1.1.1.1 remote-as 65000
 neighbor 1.1.1.1 update-source Lo0

 address-family vpnv4
  neighbor 1.1.1.1 activate
  neighbor 1.1.1.1 send-community extended
 exit-address-family

 address-family ipv4 vrf CUST-A
  redistribute connected
 exit-address-family
</pre>  
`;