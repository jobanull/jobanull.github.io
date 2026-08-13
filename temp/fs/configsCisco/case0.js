export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l3vpncisco.png" alt="contoh gambar case 0">
<span class="cmd-green">
# ================================
# P1 CONFIGURATION 
# ================================
</span>
hostname P1

<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
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
interface Port-channel1
 ip address 10.10.10.1 255.255.255.252
 ip router isis CORE
 mpls ip

interface Port-channel2
 ip address 11.11.11.1 255.255.255.252
 ip router isis CORE
 mpls ip

interface GigabitEthernet5
 ip address 12.12.12.1 255.255.255.252
 ip router isis CORE
 negotiation auto
 mpls ip
 no mop enabled
 no mop sysid

<span class="cmd-bold">
# ================================
# PORT-CHANNEL MEMBER CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 channel-group 1 mode active

interface GigabitEthernet2
 no shut
 channel-group 1 mode active

interface GigabitEthernet3
 no shut
 channel-group 2 mode active

interface GigabitEthernet4
 no shut
 channel-group 2 mode active

<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
 ip router isis CORE

<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
hostname PE1

<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force

<span class="cmd-bold">
# ================================
# VFI / VPLS CONFIGURATION
# ================================
</span>
l2vpn vfi context CUST-A
 vpn id 100
 member 3.3.3.3 encapsulation mpls
 member 5.5.5.5 encapsulation mpls

l2vpn vfi context CUST-B
 vpn id 200
 member 3.3.3.3 encapsulation mpls

<span class="cmd-bold">
# ================================
# BRIDGE DOMAIN CONFIGURATION
# ================================
</span>
bridge-domain 100
 member GigabitEthernet3 service-instance 100
 member vfi CUST-A

bridge-domain 200
 member GigabitEthernet3 service-instance 200
 member vfi CUST-B

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
interface Port-channel1
 ip address 10.10.10.2 255.255.255.252
 ip router isis CORE
 mpls ip

<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet3
 no ip address
 no shut
 service instance 100 ethernet
  encapsulation dot1q 100
 service instance 200 ethernet
  encapsulation dot1q 200

<span class="cmd-bold">
# ================================
# PORT-CHANNEL MEMBER CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 channel-group 1 mode active

interface GigabitEthernet2
 no shut
 channel-group 1 mode active

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
# PE2 CONFIGURATION 
# ================================
</span>
hostname PE2

<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force

<span class="cmd-bold">
# ================================
# VFI / VPLS CONFIGURATION
# ================================
</span>
l2vpn vfi context CUST-A
 vpn id 100
 member 2.2.2.2 encapsulation mpls

l2vpn vfi context CUST-B
 vpn id 200
 member 2.2.2.2 encapsulation mpls

<span class="cmd-bold">
# ================================
# BRIDGE DOMAIN CONFIGURATION
# ================================
</span>
bridge-domain 100
 member GigabitEthernet3 service-instance 100
 member vfi CUST-A

bridge-domain 200
 member GigabitEthernet3 service-instance 200
 member vfi CUST-B

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0030.0300.3003.00
 is-type level-2-only
 metric-style wide

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Port-channel1
 ip address 11.11.11.2 255.255.255.252
 ip router isis CORE
 mpls ip

<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet3
 no ip address
 no shut
 service instance 100 ethernet
  encapsulation dot1q 100
 service instance 200 ethernet
  encapsulation dot1q 200

<span class="cmd-bold">
# ================================
# PORT-CHANNEL MEMBER CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shut
 channel-group 1 mode active

interface GigabitEthernet2
 no shut
 channel-group 1 mode active

<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 3.3.3.3 255.255.255.255
 ip router isis CORE

<span class="cmd-green">
# ================================
# P2 CONFIGURATION 
# ================================
</span>
sysname P2

<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls lsr-id 4.4.4.4

mpls
mpls ldp
 ipv4-family

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 cost-style wide
 network-entity 49.0001.0040.0400.4004.00

<span class="cmd-bold">
# ================================
# INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/1
 undo shutdown
 ip address 13.13.13.1 255.255.255.252
 isis enable 1
 mpls
 mpls ldp

<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 4.4.4.4 32
 isis enable 1

<span class="cmd-green">
# ================================
# PE3 CONFIGURATION 
# ================================
</span>
hostname PE3

<span class="cmd-bold">
# ================================
# MPLS & ROUTER-ID CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force

<span class="cmd-bold">
# ================================
# VFI / VPLS CONFIGURATION
# ================================
</span>
l2vpn vfi context CUST-A
 vpn id 100
 member 2.2.2.2 encapsulation mpls

<span class="cmd-bold">
# ================================
# BRIDGE DOMAIN CONFIGURATION
# ================================
</span>
bridge-domain 100
 member GigabitEthernet3 service-instance 100
 member vfi CUST-A

<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0050.0500.5005.00
 is-type level-2-only
 metric-style wide

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 ip address 13.13.13.2 255.255.255.252
 ip router isis CORE
 mpls ip

<span class="cmd-bold">
# ================================
# ACCESS INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet3
 no ip address
 no shut
 service instance 100 ethernet
  encapsulation dot1q 100

<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 5.5.5.5 255.255.255.255
 ip router isis CORE
`;